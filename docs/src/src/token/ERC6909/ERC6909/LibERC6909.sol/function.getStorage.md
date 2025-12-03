# getStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC6909/ERC6909/LibERC6909.sol)

Returns a pointer to the ERC-6909 storage struct.

Uses inline assembly to access the storage slot defined by STORAGE_POSITION.


```solidity
function getStorage() pure returns (ERC6909Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC6909Storage`|The ERC6909Storage struct in storage.|


