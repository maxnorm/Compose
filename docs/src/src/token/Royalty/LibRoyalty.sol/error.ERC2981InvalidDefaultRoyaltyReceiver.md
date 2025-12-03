# ERC2981InvalidDefaultRoyaltyReceiver
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

Thrown when default royalty receiver is the zero address.


```solidity
error ERC2981InvalidDefaultRoyaltyReceiver(address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The invalid receiver address.|

