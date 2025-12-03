# setDefaultRoyalty
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

Sets the default royalty information that applies to all tokens.

Validates receiver and fee, then updates default royalty storage.


```solidity
function setDefaultRoyalty(address _receiver, uint96 _feeNumerator) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The royalty recipient address.|
|`_feeNumerator`|`uint96`|The royalty fee in basis points.|


