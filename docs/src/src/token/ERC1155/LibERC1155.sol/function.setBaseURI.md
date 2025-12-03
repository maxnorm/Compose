# setBaseURI
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Sets the base URI prefix for token-specific URIs.

The base URI is concatenated with token-specific URIs set via setTokenURI.
Does not affect the default URI used when no token-specific URI is set.


```solidity
function setBaseURI(string memory _baseURI) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_baseURI`|`string`|The base URI string to prepend to token-specific URIs.|


