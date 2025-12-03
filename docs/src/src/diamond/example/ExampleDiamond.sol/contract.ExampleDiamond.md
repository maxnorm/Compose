# ExampleDiamond
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/diamond/example/ExampleDiamond.sol)


## Functions
### constructor

Struct to hold facet address and its function selectors.
struct FacetCut {
address facetAddress;
FacetCutAction action; // Add=0, Replace=1, Remove=2
bytes4[] functionSelectors;
}

Initializes the diamond contract with facets, owner and other data.

Adds all provided facets to the diamond's function selector mapping and sets the contract owner.
Each facet in the array will have its function selectors registered to enable delegatecall routing.


```solidity
constructor(LibDiamond.FacetCut[] memory _facets, address _diamondOwner) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_facets`|`LibDiamond.FacetCut[]`|Array of facet addresses and their corresponding function selectors to add to the diamond.|
|`_diamondOwner`|`address`|Address that will be set as the owner of the diamond contract.|


### fallback


```solidity
fallback() external payable;
```

### receive


```solidity
receive() external payable;
```

