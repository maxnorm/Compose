# safeTransferFrom
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Safely transfers a single token type from one address to another.

Validates ownership, approval, and receiver address before updating balances.
Performs ERC1155Receiver validation if recipient is a contract (safe transfer).
Complies with EIP-1155 safe transfer requirements.


```solidity
function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, address _operator) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address to transfer from.|
|`_to`|`address`|The address to transfer to.|
|`_id`|`uint256`|The token type to transfer.|
|`_value`|`uint256`|The amount of tokens to transfer.|
|`_operator`|`address`|The address initiating the transfer (may be owner or approved operator).|


