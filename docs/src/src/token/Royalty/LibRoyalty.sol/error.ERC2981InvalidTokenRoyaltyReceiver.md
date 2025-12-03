# ERC2981InvalidTokenRoyaltyReceiver
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

Thrown when token-specific royalty receiver is the zero address.


```solidity
error ERC2981InvalidTokenRoyaltyReceiver(uint256 _tokenId, address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The token ID with invalid royalty configuration.|
|`_receiver`|`address`|The invalid receiver address.|

