# getStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Returns the ERC-1155 storage struct from the predefined diamond storage slot.

Uses inline assembly to set the storage slot reference.


```solidity
function getStorage() pure returns (ERC1155Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC1155Storage`|The ERC-1155 storage struct reference.|


