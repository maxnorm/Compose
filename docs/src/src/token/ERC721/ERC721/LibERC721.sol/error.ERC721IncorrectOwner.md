# ERC721IncorrectOwner
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721/LibERC721.sol)

Thrown when the sender is not the owner of the token.


```solidity
error ERC721IncorrectOwner(address _sender, uint256 _tokenId, address _owner);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|The address attempting the operation.|
|`_tokenId`|`uint256`|The ID of the token being transferred.|
|`_owner`|`address`|The actual owner of the token.|

