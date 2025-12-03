# DiamondStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/diamond/LibDiamond.sol)

**Note:**
storage-location: erc8042:compose.diamond


```solidity
struct DiamondStorage {
mapping(bytes4 functionSelector => FacetAndPosition) facetAndPosition;
/**
 * `selectors` contains all function selectors that can be called in the diamond.
 */
bytes4[] selectors;
}
```

