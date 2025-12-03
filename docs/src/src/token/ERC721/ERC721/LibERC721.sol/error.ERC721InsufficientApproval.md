# ERC721InsufficientApproval
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721/LibERC721.sol)

Thrown when an operator lacks sufficient approval to manage a token.


```solidity
error ERC721InsufficientApproval(address _operator, uint256 _tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address attempting the unauthorized operation.|
|`_tokenId`|`uint256`|The ID of the token involved.|

