# getOwnerStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/OwnerTwoSteps/LibOwnerTwoSteps.sol)

Returns a pointer to the Owner storage struct.

Uses inline assembly to access the storage slot defined by OWNER_STORAGE_POSITION.


```solidity
function getOwnerStorage() pure returns (OwnerStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`OwnerStorage`|The OwnerStorage struct in storage.|


