# setTokenURI
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Sets the token-specific URI for a given token ID.

Sets tokenURIs[_tokenId] to the provided string and emits a URI event with the full computed URI.
The emitted URI is the concatenation of baseURI and the token-specific URI.


```solidity
function setTokenURI(uint256 _tokenId, string memory _tokenURI) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The token ID to set the URI for.|
|`_tokenURI`|`string`|The token-specific URI string to be concatenated with baseURI.|


