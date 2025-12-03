# getStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721/LibERC721.sol)

Returns the ERC-721 storage struct from its predefined slot.

Uses inline assembly to access diamond storage location.


```solidity
function getStorage() pure returns (ERC721Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC721Storage`|The storage reference for ERC-721 state variables.|


