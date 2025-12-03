# safeBatchTransferFrom
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Safely transfers multiple token types from one address to another in a single transaction.

Validates ownership, approval, and receiver address before updating balances for each token type.
Performs ERC1155Receiver validation if recipient is a contract (safe transfer).
Complies with EIP-1155 safe transfer requirements.


```solidity
function safeBatchTransferFrom(
address _from,
address _to,
uint256[] memory _ids,
uint256[] memory _values,
address _operator
) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address to transfer from.|
|`_to`|`address`|The address to transfer to.|
|`_ids`|`uint256[]`|The token types to transfer.|
|`_values`|`uint256[]`|The amounts of tokens to transfer for each type.|
|`_operator`|`address`|The address initiating the transfer (may be owner or approved operator).|


