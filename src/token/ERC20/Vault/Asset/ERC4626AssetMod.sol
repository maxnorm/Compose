// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

/**
 * @notice Thrown when the configured asset address is invalid.
 * @param _asset The invalid asset address.
 */
error ERC4626InvalidAsset(address _asset);

/**
 * @notice Thrown when an asset has already been configured.
 * @param _asset The previously configured asset address.
 */
error ERC4626AssetAlreadySet(address _asset);

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
function getStorage() pure returns (ERC4626Storage storage s) {
    bytes32 position = STORAGE_POSITION;
    assembly {
        s.slot := position
    }
}

/**
 * @notice Sets the underlying asset once during diamond initialization.
 * @dev Call this free function from the diamond constructor or another protected initialization flow.
 * @param _asset The ERC-20 asset token used by the vault.
 */
function setAsset(address _asset) {
    ERC4626Storage storage s = getStorage();
    if (_asset == address(0) || _asset.code.length == 0) {
        revert ERC4626InvalidAsset(_asset);
    }
    if (s.asset != address(0)) {
        revert ERC4626AssetAlreadySet(s.asset);
    }
    s.asset = _asset;
}
