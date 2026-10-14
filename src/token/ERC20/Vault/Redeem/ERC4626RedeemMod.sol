// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

error ERC4626MathOverflow();
error ERC4626Reentrancy();
error ERC4626NoBytecodeAtAddress(address _contract);
error ERC4626TransferFailed(address _token, address _from, address _to, uint256 _amount, bytes _reason);
error ERC4626ExceededMaxRedeem(address _owner, uint256 _shares, uint256 _max);
error ERC20InvalidReceiver(address _receiver);
error ERC20InvalidSender(address _sender);
error ERC20InsufficientBalance(address _sender, uint256 _balance, uint256 _needed);
error ERC20InsufficientAllowance(address _spender, uint256 _allowance, uint256 _needed);

event Withdraw(
    address indexed _sender, address indexed _receiver, address indexed _owner, uint256 _assets, uint256 _shares
);

bytes32 constant ERC4626_STORAGE_POSITION = keccak256("erc4626");
bytes32 constant ERC20_STORAGE_POSITION = keccak256("erc20");
uint256 constant VIRTUAL_ASSET = 1;
uint256 constant VIRTUAL_SHARES = 10;

struct ERC4626Storage {
    address asset;
    uint256 reentrancyStatus;
}

struct ERC20Storage {
    mapping(address owner => uint256 balance) balanceOf;
    uint256 totalSupply;
    mapping(address owner => mapping(address spender => uint256 allowance)) allowance;
}

function getERC4626Storage() pure returns (ERC4626Storage storage s) {
    bytes32 position = ERC4626_STORAGE_POSITION;
    assembly {
        s.slot := position
    }
}

function getERC20Storage() pure returns (ERC20Storage storage s) {
    bytes32 position = ERC20_STORAGE_POSITION;
    assembly {
        s.slot := position
    }
}

function mulDiv(uint256 _x, uint256 _y, uint256 _denominator) pure returns (uint256 result) {
    uint256 prod0;
    uint256 prod1;
    assembly {
        let mm := mulmod(_x, _y, not(0))
        prod0 := mul(_x, _y)
        prod1 := sub(sub(mm, prod0), lt(mm, prod0))
    }
    if (prod1 == 0) {
        return prod0 / _denominator;
    }
    if (_denominator <= prod1) {
        revert ERC4626MathOverflow();
    }
    unchecked {
        uint256 remainder;
        assembly {
            remainder := mulmod(_x, _y, _denominator)
            prod1 := sub(prod1, gt(remainder, prod0))
            prod0 := sub(prod0, remainder)
        }
        uint256 twos = _denominator & (0 - _denominator);
        assembly {
            _denominator := div(_denominator, twos)
            prod0 := div(prod0, twos)
            twos := add(div(sub(0, twos), twos), 1)
        }
        prod0 |= prod1 * twos;
        uint256 inverse = (3 * _denominator) ^ 2;
        inverse *= 2 - _denominator * inverse;
        inverse *= 2 - _denominator * inverse;
        inverse *= 2 - _denominator * inverse;
        inverse *= 2 - _denominator * inverse;
        inverse *= 2 - _denominator * inverse;
        inverse *= 2 - _denominator * inverse;
        result = prod0 * inverse;
    }
}

function enter() {
    ERC4626Storage storage s = getERC4626Storage();
    if (s.reentrancyStatus != 0) {
        revert ERC4626Reentrancy();
    }
    s.reentrancyStatus = 1;
}

function exit() {
    delete getERC4626Storage().reentrancyStatus;
}

function safeTransfer(address _vault, address _to, uint256 _amount) {
    address token = getERC4626Storage().asset;
    if (token.code.length == 0) {
        revert ERC4626NoBytecodeAtAddress(token);
    }
    (bool success, bytes memory returnData) = token.call(abi.encodeWithSelector(bytes4(0xa9059cbb), _to, _amount));
    if (!success || !isSuccessfulReturn(returnData)) {
        revert ERC4626TransferFailed(token, _vault, _to, _amount, returnData);
    }
}

/**
 *  @notice Validates optional ERC-20 return data without decoding malformed payloads.
 */
function isSuccessfulReturn(bytes memory _returnData) pure returns (bool) {
    if (_returnData.length == 0) {
        return true;
    }
    if (_returnData.length < 32) {
        return false;
    }
    uint256 result;
    assembly ("memory-safe") {
        result := mload(add(_returnData, 0x20))
    }
    return result == 1;
}

/**
 *  @notice Returns the owner's redeemable shares, capped by available liquidity.
 */
function maxRedeem(address _owner, uint256 _totalAssets, uint256 _availableAssets) view returns (uint256 maxShares) {
    ERC20Storage storage erc20s = getERC20Storage();
    maxShares = erc20s.balanceOf[_owner];
    uint256 liquidShares = mulDiv(_availableAssets, erc20s.totalSupply + VIRTUAL_SHARES, _totalAssets + VIRTUAL_ASSET);
    if (maxShares > liquidShares) {
        maxShares = liquidShares;
    }
}

/**
 *  @notice Returns assets for shares, rounded down.
 */
function previewRedeem(uint256 _shares, uint256 _totalAssets, uint256 _totalSupply) pure returns (uint256) {
    return mulDiv(_shares, _totalAssets + VIRTUAL_ASSET, _totalSupply + VIRTUAL_SHARES);
}

/**
 * @notice Burns shares and transfers their asset value to the receiver.
 * @dev Pass total and liquid assets measured before this operation. `_vault` must be the caller diamond.
 * @param _shares The number of shares to redeem.
 * @param _receiver The account receiving the assets.
 * @param _owner The account whose shares are burned.
 * @param _totalAssets The pre-redeem total assets.
 * @param _availableAssets Assets currently available to redeem.
 * @param _vault The diamond from which assets are transferred.
 * @return assets The amount of assets transferred.
 */
function redeem(
    uint256 _shares,
    address _receiver,
    address _owner,
    uint256 _totalAssets,
    uint256 _availableAssets,
    address _vault
) returns (uint256 assets) {
    if (_receiver == address(0)) {
        revert ERC20InvalidReceiver(address(0));
    }
    if (_owner == address(0)) {
        revert ERC20InvalidSender(address(0));
    }

    enter();
    ERC20Storage storage erc20s = getERC20Storage();
    uint256 ownerBalance = erc20s.balanceOf[_owner];
    uint256 maxShares = maxRedeem(_owner, _totalAssets, _availableAssets);
    if (_shares > maxShares) {
        revert ERC4626ExceededMaxRedeem(_owner, _shares, maxShares);
    }
    if (msg.sender != _owner) {
        uint256 currentAllowance = erc20s.allowance[_owner][msg.sender];
        if (currentAllowance < _shares) {
            revert ERC20InsufficientAllowance(msg.sender, currentAllowance, _shares);
        }
        if (currentAllowance != type(uint256).max) {
            unchecked {
                erc20s.allowance[_owner][msg.sender] = currentAllowance - _shares;
            }
        }
    }

    assets = previewRedeem(_shares, _totalAssets, erc20s.totalSupply);
    unchecked {
        erc20s.balanceOf[_owner] = ownerBalance - _shares;
        erc20s.totalSupply -= _shares;
    }
    safeTransfer(_vault, _receiver, assets);
    emit Withdraw(msg.sender, _receiver, _owner, assets, _shares);
    exit();
}
