// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

import "src/token/ERC20/Vault/Asset/ERC4626AssetMod.sol" as ERC4626AssetMod;

contract ERC4626VaultHarness {
    error ERC4626HarnessUnknownSelector(bytes4 _selector);

    mapping(bytes4 selector => address facet) internal facetForSelector;

    constructor(address[] memory _facets, address _asset) {
        for (uint256 i; i < _facets.length; i++) {
            _registerFacet(_facets[i]);
        }
        ERC4626AssetMod.setAsset(_asset);
    }

    function _registerFacet(address _facet) internal {
        (bool success, bytes memory result) = _facet.staticcall(abi.encodeWithSignature("exportSelectors()"));
        if (!success) {
            revert ERC4626HarnessUnknownSelector(bytes4(0));
        }
        for (uint256 i; i < result.length; i += 4) {
            bytes4 selector;
            assembly ("memory-safe") {
                selector := mload(add(add(result, 0x20), i))
            }
            facetForSelector[selector] = _facet;
        }
    }

    fallback() external payable {
        address facet = facetForSelector[msg.sig];
        if (facet == address(0)) {
            revert ERC4626HarnessUnknownSelector(msg.sig);
        }
        (bool success, bytes memory result) = facet.delegatecall(msg.data);
        assembly ("memory-safe") {
            switch success
            case 0 { revert(add(result, 0x20), mload(result)) }
            default { return(add(result, 0x20), mload(result)) }
        }
    }
}
