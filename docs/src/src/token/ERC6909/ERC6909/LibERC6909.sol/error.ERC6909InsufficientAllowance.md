# ERC6909InsufficientAllowance
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC6909/ERC6909/LibERC6909.sol)

Thrown when the spender has insufficient allowance.


```solidity
error ERC6909InsufficientAllowance(address _spender, uint256 _allowance, uint256 _needed, uint256 _id);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_spender`|`address`|The address attempting the transfer.|
|`_allowance`|`uint256`|The spender's current allowance.|
|`_needed`|`uint256`|The amount required to complete the operation.|
|`_id`|`uint256`|The token ID.|

