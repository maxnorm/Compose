# TransferBatch
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Emitted when multiple token types are transferred.


```solidity
event TransferBatch(
address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values
);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address which initiated the batch transfer.|
|`_from`|`address`|The address which previously owned the tokens.|
|`_to`|`address`|The address which now owns the tokens.|
|`_ids`|`uint256[]`|The token types being transferred.|
|`_values`|`uint256[]`|The amounts of tokens transferred.|

