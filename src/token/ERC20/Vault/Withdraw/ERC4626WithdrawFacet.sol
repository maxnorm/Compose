// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

contract ERC4626WithdrawFacet {
    /**
     * @notice ERC-20 errors and ERC-4626 errors used by this feature.
     */
    error ERC4626InvalidAsset(address _asset);
    error ERC4626MathOverflow();
    error ERC4626Reentrancy();
    error ERC4626NoBytecodeAtAddress(address _contract);
    error ERC4626TransferFailed(address _token, address _from, address _to, uint256 _amount, bytes _reason);
    error ERC4626ExceededMaxWithdraw(address _owner, uint256 _assets, uint256 _max);
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
     * _y / _denominator) with full precision.
     */
    function mulDivUp(uint256 _x, uint256 _y, uint256 _denominator) internal pure returns (uint256 result) {
        result = mulDiv(_x, _y, _denominator);
        if (mulmod(_x, _y, _denominator) != 0) {
            if (result == type(uint256).max) {
                revert ERC4626MathOverflow();
            }
            result++;
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
     * @notice Calculates the owner's maximum withdrawal limited by liquid assets.
     */
    function maxWithdrawFor(address _owner) internal view returns (uint256 maxAssets) {
        ERC20Storage storage erc20s = getERC20Storage();
        uint256 availableAssets = assetBalance();
        maxAssets =
            mulDiv(erc20s.balanceOf[_owner], availableAssets + VIRTUAL_ASSET, erc20s.totalSupply + VIRTUAL_SHARES);
        if (maxAssets > availableAssets) {
            maxAssets = availableAssets;
        }
    }

    /**
     * @notice Returns the maximum assets that can currently be withdrawn for an owner.
     */
    function maxWithdraw(address _owner) external view returns (uint256) {
        return maxWithdrawFor(_owner);
    }

    /**
     * @notice Returns shares required to withdraw assets, rounded up.
     */
    function previewWithdraw(uint256 _assets) external view returns (uint256) {
        ERC20Storage storage erc20s = getERC20Storage();
        return mulDivUp(erc20s.totalSupply + VIRTUAL_SHARES, _assets, assetBalance() + VIRTUAL_ASSET);
    }

    /**
     * @notice Withdraws an exact amount of assets and burns the owner's shares.
     * @param _assets The amount of assets to withdraw.
     * @param _receiver The account receiving the assets.
     * @param _owner The account whose shares are burned.
     * @return shares The amount of shares burned.
     */
    function withdraw(uint256 _assets, address _receiver, address _owner) external returns (uint256 shares) {
        if (_receiver == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        if (_owner == address(0)) {
            revert ERC20InvalidSender(address(0));
        }

        enter();
        uint256 maxAssets = maxWithdrawFor(_owner);
        if (_assets > maxAssets) {
            revert ERC4626ExceededMaxWithdraw(_owner, _assets, maxAssets);
        }

        ERC20Storage storage erc20s = getERC20Storage();
        shares = mulDivUp(erc20s.totalSupply + VIRTUAL_SHARES, _assets, assetBalance() + VIRTUAL_ASSET);
        if (msg.sender != _owner) {
            uint256 currentAllowance = erc20s.allowance[_owner][msg.sender];
            if (currentAllowance < shares) {
                revert ERC20InsufficientAllowance(msg.sender, currentAllowance, shares);
            }
            if (currentAllowance != type(uint256).max) {
                unchecked {
                    erc20s.allowance[_owner][msg.sender] = currentAllowance - shares;
                }
            }
        }

        uint256 ownerBalance = erc20s.balanceOf[_owner];
        if (ownerBalance < shares) {
            revert ERC20InsufficientBalance(_owner, ownerBalance, shares);
        }
        unchecked {
            erc20s.balanceOf[_owner] = ownerBalance - shares;
            erc20s.totalSupply -= shares;
        }
        safeTransfer(_receiver, _assets);
        emit Withdraw(msg.sender, _receiver, _owner, _assets, shares);
        exit();
    }

    /**
     * @notice Exports this feature facet's function selectors.
     */
    function exportSelectors() external pure returns (bytes memory) {
        return bytes.concat(this.maxWithdraw.selector, this.previewWithdraw.selector, this.withdraw.selector);
    }
}
