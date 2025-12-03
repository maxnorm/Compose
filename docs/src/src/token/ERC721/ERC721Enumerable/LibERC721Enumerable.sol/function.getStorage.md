# getStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721Enumerable/LibERC721Enumerable.sol)

Returns the ERC-721 enumerable storage struct from its predefined slot.

Uses inline assembly to point to the correct diamond storage position.


```solidity
function getStorage() pure returns (ERC721EnumerableStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC721EnumerableStorage`|The storage reference for ERC-721 enumerable state variables.|


