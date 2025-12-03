# ERC2981InvalidDefaultRoyalty
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

Thrown when default royalty fee exceeds 100% (10000 basis points).


```solidity
error ERC2981InvalidDefaultRoyalty(uint256 _numerator, uint256 _denominator);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_numerator`|`uint256`|The fee numerator that exceeds the denominator.|
|`_denominator`|`uint256`|The fee denominator (10000 basis points).|

