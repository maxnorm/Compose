# getStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20/LibERC20.sol)

Returns a pointer to the ERC-20 storage struct.

Uses inline assembly to bind the storage struct to the fixed storage position.


```solidity
function getStorage() pure returns (ERC20Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC20Storage`|The ERC-20 storage struct.|


