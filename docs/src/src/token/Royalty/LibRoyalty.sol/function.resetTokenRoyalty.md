# resetTokenRoyalty
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

Resets royalty information for a specific token to use the default setting.

Clears token-specific royalty storage, causing fallback to default royalty.


```solidity
function resetTokenRoyalty(uint256 _tokenId) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The token ID to reset royalty configuration for.|


