// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

error ERC4626MathOverflow();
error ERC4626Reentrancy();
error ERC4626NoBytecodeAtAddress(address _contract);
error ERC4626TransferFailed(address _token, address _from, address _to, uint256 _amount, bytes _reason);
error ERC4626ExceededMaxMint(address _receiver, uint256 _shares, uint256 _max);
error ERC20InvalidReceiver(address _receiver);

event Deposit(address indexed _sender, address indexed _owner, uint256 _assets, uint256 _shares);

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

function mulDivUp(uint256 _x, uint256 _y, uint256 _denominator) pure returns (uint256 result) {
    result = mulDiv(_x, _y, _denominator);
    if (mulmod(_x, _y, _denominator) != 0) {
        if (result == type(uint256).max) {
            revert ERC4626MathOverflow();
        }
        result++;
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

function safeTransferFrom(address _from, address _to, uint256 _amount) {
    address token = getERC4626Storage().asset;
    if (token.code.length == 0) {
        revert ERC4626NoBytecodeAtAddress(token);
    }
    (bool success, bytes memory returnData) =
        token.call(abi.encodeWithSelector(bytes4(0x23b872dd), _from, _to, _amount));
    if (!success || !isSuccessfulReturn(returnData)) {
        revert ERC4626TransferFailed(token, _from, _to, _amount, returnData);
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
 *  @notice Returns the maximum shares for the base vault, which has no mint cap.
 */
function maxMint(address) pure returns (uint256) {
    return type(uint256).max;
}

/**
 * @notice Returns the asset amount needed to mint shares using caller-supplied accounting totals.
 * @param _shares The number of shares to mint.
 * @param _totalAssets The pre-mint total assets, including any strategy positions.
 * @param _totalSupply The current share supply.
 */
function previewMint(uint256 _shares, uint256 _totalAssets, uint256 _totalSupply) pure returns (uint256) {
    return mulDivUp(_totalAssets + VIRTUAL_ASSET, _shares, _totalSupply + VIRTUAL_SHARES);
}

/**
 * @notice Transfers the required assets from the caller and mints exactly `_shares` to the receiver.
 * @dev `_totalAssets` must be measured before transferring assets into the vault. `_vault` must be the caller diamond.
 * @param _shares The number of shares to mint.
 * @param _receiver The account receiving shares.
 * @param _totalAssets The pre-mint total assets.
 * @param _vault The diamond address receiving the underlying assets.
 * @return assets The amount of assets deposited.
 */
function mint(uint256 _shares, address _receiver, uint256 _totalAssets, address _vault) returns (uint256 assets) {
    if (_receiver == address(0)) {
        revert ERC20InvalidReceiver(address(0));
    }
    uint256 maxShares = maxMint(_receiver);
    if (_shares > maxShares) {
        revert ERC4626ExceededMaxMint(_receiver, _shares, maxShares);
    }

    enter();
    ERC20Storage storage erc20s = getERC20Storage();
    assets = previewMint(_shares, _totalAssets, erc20s.totalSupply);
    safeTransferFrom(msg.sender, _vault, assets);
    erc20s.totalSupply += _shares;
    erc20s.balanceOf[_receiver] += _shares;
    emit Deposit(msg.sender, _receiver, assets, _shares);
    exit();
}
