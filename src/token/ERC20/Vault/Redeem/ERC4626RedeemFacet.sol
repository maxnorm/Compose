// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

contract ERC4626RedeemFacet {
    /**
     * @notice ERC-20 errors and ERC-4626 errors used by this feature.
     */
    error ERC4626InvalidAsset(address _asset);
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
    /**
     * @dev Virtual values implement the fixed one-decimal offset.
     */
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

    /**
     * @notice Returns the shared ERC-4626 storage struct.
     */
    function getERC4626Storage() internal pure returns (ERC4626Storage storage s) {
        bytes32 position = ERC4626_STORAGE_POSITION;
        assembly {
            s.slot := position
        }
    }

    /**
     * @notice Returns the ERC-20 share storage struct.
     */
    function getERC20Storage() internal pure returns (ERC20Storage storage s) {
        bytes32 position = ERC20_STORAGE_POSITION;
        assembly {
            s.slot := position
        }
    }

    /**
     * _y / _denominator) with full precision.
     */
    function mulDiv(uint256 _x, uint256 _y, uint256 _denominator) internal pure returns (uint256 result) {
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

    /**
     * @notice Returns the vault's current underlying asset balance.
     */
    function assetBalance() internal view returns (uint256 balance) {
        address assetAddress = getERC4626Storage().asset;
        if (assetAddress.code.length == 0) {
            revert ERC4626InvalidAsset(assetAddress);
        }
        (bool success, bytes memory returnData) =
            assetAddress.staticcall(abi.encodeWithSelector(bytes4(0x70a08231), address(this)));
        if (!success || returnData.length < 32) {
            revert ERC4626InvalidAsset(assetAddress);
        }
        balance = abi.decode(returnData, (uint256));
    }

    /**
     * @notice Locks ERC-4626 mutating features against reentrancy.
     */
    function enter() internal {
        ERC4626Storage storage s = getERC4626Storage();
        if (s.reentrancyStatus != 0) {
            revert ERC4626Reentrancy();
        }
        s.reentrancyStatus = 1;
    }

    /**
     * @notice Releases the shared ERC-4626 reentrancy lock.
     */
    function exit() internal {
        delete getERC4626Storage().reentrancyStatus;
    }

    /**
     * @notice Transfers assets from the vault and supports no-return ERC-20 tokens.
     */
    function safeTransfer(address _to, uint256 _amount) internal {
        address token = getERC4626Storage().asset;
        if (token.code.length == 0) {
            revert ERC4626NoBytecodeAtAddress(token);
        }
        (bool success, bytes memory returnData) = token.call(abi.encodeWithSelector(bytes4(0xa9059cbb), _to, _amount));
        if (!success || !isSuccessfulReturn(returnData)) {
            revert ERC4626TransferFailed(token, address(this), _to, _amount, returnData);
        }
    }

    /**
     * @notice Validates optional ERC-20 return data without decoding malformed payloads.
     */
    function isSuccessfulReturn(bytes memory _returnData) internal pure returns (bool) {
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
     * @notice Returns the owner's current share balance as the maximum redeemable amount.
     */
    function maxRedeem(address _owner) external view returns (uint256) {
        return getERC20Storage().balanceOf[_owner];
    }

    /**
     * @notice Returns assets for shares, rounded down.
     */
    function previewRedeem(uint256 _shares) external view returns (uint256) {
        ERC20Storage storage erc20s = getERC20Storage();
        return mulDiv(_shares, assetBalance() + VIRTUAL_ASSET, erc20s.totalSupply + VIRTUAL_SHARES);
    }

    /**
     * @notice Redeems shares and transfers their asset value to a receiver.
     * @param _shares The number of shares to redeem.
     * @param _receiver The account receiving the assets.
     * @param _owner The account whose shares are burned.
     * @return assets The amount of assets withdrawn.
     */
    function redeem(uint256 _shares, address _receiver, address _owner) external returns (uint256 assets) {
        if (_receiver == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        if (_owner == address(0)) {
            revert ERC20InvalidSender(address(0));
        }

        enter();
        ERC20Storage storage erc20s = getERC20Storage();
        uint256 ownerBalance = erc20s.balanceOf[_owner];
        uint256 maxShares = ownerBalance;
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

        assets = mulDiv(_shares, assetBalance() + VIRTUAL_ASSET, erc20s.totalSupply + VIRTUAL_SHARES);
        unchecked {
            erc20s.balanceOf[_owner] = ownerBalance - _shares;
            erc20s.totalSupply -= _shares;
        }
        safeTransfer(_receiver, assets);
        emit Withdraw(msg.sender, _receiver, _owner, assets, _shares);
        exit();
    }

    /**
     * @notice Exports this feature facet's function selectors.
     */
    function exportSelectors() external pure returns (bytes memory) {
        return bytes.concat(this.maxRedeem.selector, this.previewRedeem.selector, this.redeem.selector);
    }
}
