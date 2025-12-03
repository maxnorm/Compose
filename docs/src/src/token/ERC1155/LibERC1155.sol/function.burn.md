# burn
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Burns a single token type from an address.

Decreases the balance and emits a TransferSingle event.
Reverts if the account has insufficient balance.


```solidity
function burn(address _from, uint256 _id, uint256 _value) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address whose tokens will be burned.|
|`_id`|`uint256`|The token type to burn.|
|`_value`|`uint256`|The amount of tokens to burn.|


