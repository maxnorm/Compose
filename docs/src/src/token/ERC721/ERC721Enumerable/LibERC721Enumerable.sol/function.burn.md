# burn
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721Enumerable/LibERC721Enumerable.sol)

Burns (destroys) an existing ERC-721 token, removing it from enumeration lists.

Reverts if the token does not exist or if the sender is not authorized.


```solidity
function burn(uint256 _tokenId, address _sender) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The ID of the token to burn.|
|`_sender`|`address`|The address initiating the burn.|


