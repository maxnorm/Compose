# getStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/interfaceDetection/ERC165/LibERC165.sol)

Returns a pointer to the ERC-165 storage struct.

Uses inline assembly to bind the storage struct to the fixed storage position.


```solidity
function getStorage() pure returns (ERC165Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC165Storage`|The ERC-165 storage struct.|


