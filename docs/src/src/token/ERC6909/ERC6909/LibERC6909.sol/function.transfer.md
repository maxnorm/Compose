# transfer
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC6909/ERC6909/LibERC6909.sol)

Transfers `_amount` of token id `_id` from `_from` to `_to`.

Allowance is not deducted if it is `type(uint256).max`

Allowance is not deducted if `_by` is an operator for `_from`.


```solidity
function transfer(address _by, address _from, address _to, uint256 _id, uint256 _amount) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_by`|`address`|The address initiating the transfer.|
|`_from`|`address`|The address of the sender.|
|`_to`|`address`|The address of the receiver.|
|`_id`|`uint256`|The id of the token.|
|`_amount`|`uint256`|The amount of the token.|


