# registerInterface
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/interfaceDetection/ERC165/LibERC165.sol)

Register that a contract supports an interface

Call this function during initialization to register supported interfaces.
For example, in an ERC721 facet initialization, you would call:
`LibERC165.registerInterface(type(IERC721).interfaceId)`


```solidity
function registerInterface(bytes4 _interfaceId) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_interfaceId`|`bytes4`|The interface ID to register|


