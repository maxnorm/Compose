# ERC1155InvalidArrayLength
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Thrown when array lengths don't match in batch operations.


```solidity
error ERC1155InvalidArrayLength(uint256 _idsLength, uint256 _valuesLength);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_idsLength`|`uint256`|Length of the ids array.|
|`_valuesLength`|`uint256`|Length of the values array.|

