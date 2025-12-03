# burnBatch
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Burns multiple token types from an address in a single transaction.

Decreases balances for each token type and emits a TransferBatch event.
Reverts if the account has insufficient balance for any token type.


```solidity
function burnBatch(address _from, uint256[] memory _ids, uint256[] memory _values) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address whose tokens will be burned.|
|`_ids`|`uint256[]`|The token types to burn.|
|`_values`|`uint256[]`|The amounts of tokens to burn for each type.|


