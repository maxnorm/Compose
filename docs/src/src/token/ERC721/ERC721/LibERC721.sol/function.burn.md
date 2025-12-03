# burn
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721/LibERC721.sol)

Burns (destroys) a specific ERC-721 token.

Reverts if the token does not exist. Clears ownership and approval.


```solidity
function burn(uint256 _tokenId) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The ID of the token to burn.|


