# RoyaltyInfo
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

Structure containing royalty information.


```solidity
struct RoyaltyInfo {
address receiver;
uint96 royaltyFraction;
}
```

**Properties**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`address`|The address that will receive royalty payments.|
|`royaltyFraction`|`uint96`|The royalty fee expressed in basis points.|

