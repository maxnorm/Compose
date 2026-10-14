// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

contract ERC4626AssetFacet {
    /**
     * @notice Thrown when the configured asset address is not a contract.
     * @param _asset The invalid asset address.
     */
    error ERC4626InvalidAsset(address _asset);

    /**
     * @dev Storage position for ERC-4626 vault configuration.
     */
    bytes32 constant STORAGE_POSITION = keccak256("erc4626");

    /**
     * @dev ERC-8042 compliant storage for ERC-4626 vault configuration.
     * @custom:storage-location erc8042:erc4626
     */
    struct ERC4626Storage {
        address asset;
        uint256 reentrancyStatus;
    }

    /**
     * @notice Returns the ERC-4626 storage struct.
     * @dev Uses inline assembly to bind the struct to its namespaced storage position.
     * @return s The ERC-4626 storage struct.
     */
    function getStorage() internal pure returns (ERC4626Storage storage s) {
        bytes32 position = STORAGE_POSITION;
        assembly {
            s.slot := position
        }
    }

    /**
     * @notice Returns the address of the underlying asset token.
     * @return The address of the ERC-20 asset used by the vault.
     */
    function asset() external view returns (address) {
        return getStorage().asset;
    }

    /**
     * @notice Returns the total underlying assets held by this vault.
     * @dev Strategy facets should replace this selector with accounting that includes their managed positions.
     * @return The actual asset-token balance of the vault. Virtual conversion values are not included.
     */
    function totalAssets() external view returns (uint256) {
        address assetAddress = getStorage().asset;
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
     * @notice Exports the function selectors of the ERC4626AssetFacet.
     * @return selectors The selectors for `asset` and `totalAssets`.
     */
    function exportSelectors() external pure returns (bytes memory) {
        return bytes.concat(this.asset.selector, this.totalAssets.selector);
    }
}
