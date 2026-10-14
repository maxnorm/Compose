// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

contract ERC4626DepositFacet {
    /**
     * @notice Thrown when the asset call does not succeed or returns false or malformed data.
     */
    error ERC4626InvalidAsset(address _asset);
    error ERC4626MathOverflow();
    error ERC4626Reentrancy();
    error ERC4626NoBytecodeAtAddress(address _contract);
    error ERC4626TransferFailed(address _token, address _from, address _to, uint256 _amount, bytes _reason);
    error ERC4626ExceededMaxDeposit(address _receiver, uint256 _assets, uint256 _max);
    error ERC20InvalidReceiver(address _receiver);

    /**
     * @notice Emitted when assets are deposited and shares are minted.
     * @param _sender The caller that supplied the assets.
     * @param _owner The account receiving the shares.
     * @param _assets The amount of assets deposited.
     * @param _shares The amount of shares minted.
     */
    event Deposit(address indexed _sender, address indexed _owner, uint256 _assets, uint256 _shares);

    bytes32 constant ERC4626_STORAGE_POSITION = keccak256("erc4626");
    bytes32 constant ERC20_STORAGE_POSITION = keccak256("erc20");
    /**
     * @dev Virtual asset and share amounts implementing a one-decimal offset.
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
     * @notice Returns the namespaced ERC-4626 storage struct.
     */
    function getERC4626Storage() internal pure returns (ERC4626Storage storage s) {
        bytes32 position = ERC4626_STORAGE_POSITION;
        assembly {
            s.slot := position
        }
    }

    /**
     * @notice Returns the ERC-20 storage struct shared with the other ERC-20 facets.
     */
    function getERC20Storage() internal pure returns (ERC20Storage storage s) {
        bytes32 position = ERC20_STORAGE_POSITION;
        assembly {
            s.slot := position
        }
    }

    /**
     * @notice Computes floor(_x * _y / _denominator) with full precision.
     * @dev Based on Remco Bloemen's mulDiv algorithm: https://xn--2-umb.com/21/muldiv/.
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
     * @notice Locks all ERC-4626 mutating features against reentrancy.
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
     * @notice Transfers assets from an owner while supporting tokens with no return data.
     */
    function safeTransferFrom(address _from, address _to, uint256 _amount) internal {
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
     * @notice Checks an optional ERC-20 boolean return value without decoding malformed data.
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
     * @notice Returns the maximum amount of assets that can be deposited.
     * @dev The base vault has no deposit cap.
     */
    function maxDeposit(address) external pure returns (uint256) {
        return type(uint256).max;
    }

    /**
     * @notice Returns shares that would be minted for a deposit, rounded down.
     * @param _assets The amount of assets to deposit.
     */
    function previewDeposit(uint256 _assets) external view returns (uint256) {
        ERC20Storage storage erc20s = getERC20Storage();
        return mulDiv(_assets, erc20s.totalSupply + VIRTUAL_SHARES, assetBalance() + VIRTUAL_ASSET);
    }

    /**
     * @notice Deposits assets and mints the calculated shares to the receiver.
     * @param _assets The amount of assets to deposit.
     * @param _receiver The account that receives the shares.
     * @return shares The amount of shares minted.
     */
    function deposit(uint256 _assets, address _receiver) external returns (uint256 shares) {
        if (_receiver == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        uint256 maxAssets = type(uint256).max;
        if (_assets > maxAssets) {
            revert ERC4626ExceededMaxDeposit(_receiver, _assets, maxAssets);
        }

        enter();
        ERC20Storage storage erc20s = getERC20Storage();
        shares = mulDiv(_assets, erc20s.totalSupply + VIRTUAL_SHARES, assetBalance() + VIRTUAL_ASSET);
        safeTransferFrom(msg.sender, address(this), _assets);
        erc20s.totalSupply += shares;
        erc20s.balanceOf[_receiver] += shares;
        emit Deposit(msg.sender, _receiver, _assets, shares);
        exit();
    }

    /**
     * @notice Exports this feature facet's function selectors.
     */
    function exportSelectors() external pure returns (bytes memory) {
        return bytes.concat(this.maxDeposit.selector, this.previewDeposit.selector, this.deposit.selector);
    }
}
