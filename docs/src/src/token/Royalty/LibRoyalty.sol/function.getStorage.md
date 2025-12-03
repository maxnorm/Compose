# getStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

Returns the royalty storage struct from its predefined slot.

Uses inline assembly to access diamond storage location.


```solidity
function getStorage() pure returns (RoyaltyStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`RoyaltyStorage`|The storage reference for royalty state variables.|


