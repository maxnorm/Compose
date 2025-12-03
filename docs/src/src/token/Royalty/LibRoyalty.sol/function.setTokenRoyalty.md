# setTokenRoyalty
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

Sets royalty information for a specific token, overriding the default.

Validates receiver and fee, then updates token-specific royalty storage.


```solidity
function setTokenRoyalty(uint256 _tokenId, address _receiver, uint96 _feeNumerator) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The token ID to configure royalty for.|
|`_receiver`|`address`|The royalty recipient address.|
|`_feeNumerator`|`uint96`|The royalty fee in basis points.|


