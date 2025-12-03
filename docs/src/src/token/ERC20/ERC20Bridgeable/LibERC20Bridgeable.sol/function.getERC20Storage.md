# getERC20Storage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Bridgeable/LibERC20Bridgeable.sol)

Returns the ERC20 storage struct from the predefined diamond storage slot.

Uses inline assembly to set the storage slot reference.


```solidity
function getERC20Storage() pure returns (ERC20Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC20Storage`|The ERC20 storage struct reference.|


