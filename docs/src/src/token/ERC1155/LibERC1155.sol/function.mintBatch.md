# mintBatch
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Mints multiple token types to an address in a single transaction.

Increases balances for each token type and emits a TransferBatch event.
Performs receiver validation if recipient is a contract.


```solidity
function mintBatch(address _to, uint256[] memory _ids, uint256[] memory _values, bytes memory _data) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The address that will receive the tokens.|
|`_ids`|`uint256[]`|The token types to mint.|
|`_values`|`uint256[]`|The amounts of tokens to mint for each type.|
|`_data`|`bytes`||


