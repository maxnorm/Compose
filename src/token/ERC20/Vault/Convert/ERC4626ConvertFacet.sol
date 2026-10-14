// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

contract ERC4626ConvertFacet {
    /**
     * @notice Thrown when the configured asset address is invalid.
     * @param _asset The invalid asset address.
     */
    error ERC4626InvalidAsset(address _asset);

    /**
     * @notice Thrown when a full-precision multiplication result cannot fit in uint256.
     */
    error ERC4626MathOverflow();

    /**
     * @dev Storage positions for ERC-4626 configuration and ERC-20 shares.
     */
    bytes32 constant ERC4626_STORAGE_POSITION = keccak256("erc4626");
    bytes32 constant ERC20_STORAGE_POSITION = keccak256("erc20");

    /**
     * @dev Virtual values used to mitigate first-depositor inflation attacks.
     * @custom:decimals-offset 1
     */
    uint256 constant VIRTUAL_ASSET = 1;
    uint256 constant VIRTUAL_SHARES = 10;

    /**
     * @dev ERC-8042 compliant storage for ERC-4626 vault configuration.
     * @custom:storage-location erc8042:erc4626
     */
    struct ERC4626Storage {
        address asset;
        uint256 reentrancyStatus;
    }

    /**
     * @dev ERC-8042 compliant storage shared with the Compose ERC-20 facets.
     * @custom:storage-location erc8042:erc20
     */
    struct ERC20Storage {
        mapping(address owner => uint256 balance) balanceOf;
        uint256 totalSupply;
        mapping(address owner => mapping(address spender => uint256 allowance)) allowance;
    }

    /**
     * @notice Returns the ERC-4626 storage struct.
     * @return s The ERC-4626 storage struct.
     */
    function getERC4626Storage() internal pure returns (ERC4626Storage storage s) {
        bytes32 position = ERC4626_STORAGE_POSITION;
        assembly {
            s.slot := position
        }
    }

    /**
     * @notice Returns the ERC-20 share storage struct.
     * @return s The ERC-20 storage struct.
     */
    function getERC20Storage() internal pure returns (ERC20Storage storage s) {
        bytes32 position = ERC20_STORAGE_POSITION;
        assembly {
            s.slot := position
        }
    }

    /**
     * @notice Computes floor(_x * _y / _denominator) with full precision.
     * @dev Uses 512-bit multiplication so an intermediate product can overflow without losing a valid quotient.
     *      Based on Remco Bloemen's mulDiv algorithm: https://xn--2-umb.com/21/muldiv/.
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
     * @notice Returns the asset amount for shares, rounded up.
     * @dev Used when the caller must provide at least the requested share value.
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
     * @notice Returns the total underlying asset balance for conversion calculations.
     * @dev This basic facet values only assets held directly by the diamond.
     */
    function totalAssetsForConversion() internal view returns (uint256) {
        address assetAddress = getERC4626Storage().asset;
        if (assetAddress.code.length == 0) {
            revert ERC4626InvalidAsset(assetAddress);
        }
        (bool success, bytes memory returnData) =
            assetAddress.staticcall(abi.encodeWithSelector(bytes4(0x70a08231), address(this)));
        if (!success || returnData.length < 32) {
            revert ERC4626InvalidAsset(assetAddress);
        }
        return abi.decode(returnData, (uint256));
    }

    /**
     * @notice Converts assets to shares, rounding down as required by ERC-4626.
     * @param _assets The asset amount to convert.
     * @return The corresponding share amount.
     */
    function convertToShares(uint256 _assets) external view returns (uint256) {
        uint256 totalAssets = totalAssetsForConversion();
        uint256 totalShares = getERC20Storage().totalSupply;
        return mulDiv(_assets, totalShares + VIRTUAL_SHARES, totalAssets + VIRTUAL_ASSET);
    }

    /**
     * @notice Converts shares to assets, rounding down as required by ERC-4626.
     * @param _shares The share amount to convert.
     * @return The corresponding asset amount.
     */
    function convertToAssets(uint256 _shares) external view returns (uint256) {
        uint256 totalAssets = totalAssetsForConversion();
        uint256 totalShares = getERC20Storage().totalSupply;
        return mulDiv(_shares, totalAssets + VIRTUAL_ASSET, totalShares + VIRTUAL_SHARES);
    }

    /**
     * @notice Exports the function selectors of the ERC4626ConvertFacet.
     * @return selectors The selectors for `convertToShares` and `convertToAssets`.
     */
    function exportSelectors() external pure returns (bytes memory) {
        return bytes.concat(this.convertToShares.selector, this.convertToAssets.selector);
    }
}
