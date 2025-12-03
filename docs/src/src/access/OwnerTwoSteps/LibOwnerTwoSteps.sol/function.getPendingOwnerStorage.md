# getPendingOwnerStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/OwnerTwoSteps/LibOwnerTwoSteps.sol)

Returns a pointer to the PendingOwner storage struct.

Uses inline assembly to access the storage slot defined by PENDING_OWNER_STORAGE_POSITION.


```solidity
function getPendingOwnerStorage() pure returns (PendingOwnerStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`PendingOwnerStorage`|The PendingOwnerStorage struct in storage.|


