# ERC721NonexistentToken
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721/LibERC721.sol)

Thrown when attempting to interact with a non-existent token.


```solidity
error ERC721NonexistentToken(uint256 _tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The ID of the token that does not exist.|

