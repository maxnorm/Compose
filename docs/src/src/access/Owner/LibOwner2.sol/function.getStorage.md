# getStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/Owner/LibOwner2.sol)

Returns a pointer to the ERC-173 storage struct.

Uses inline assembly to access the storage slot defined by STORAGE_POSITION.


```solidity
function getStorage() pure returns (OwnerStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`OwnerStorage`|The OwnerStorage struct in storage.|


