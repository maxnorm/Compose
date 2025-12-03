# ERC1155MissingApprovalForAll
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Thrown when missing approval for an operator.


```solidity
error ERC1155MissingApprovalForAll(address _operator, address _owner);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|Address attempting the operation.|
|`_owner`|`address`|The token owner.|

