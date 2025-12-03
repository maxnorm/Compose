# TransferSingle
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Emitted when a single token type is transferred.


```solidity
event TransferSingle(
address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value
);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address which initiated the transfer.|
|`_from`|`address`|The address which previously owned the token.|
|`_to`|`address`|The address which now owns the token.|
|`_id`|`uint256`|The token type being transferred.|
|`_value`|`uint256`|The amount of tokens transferred.|

