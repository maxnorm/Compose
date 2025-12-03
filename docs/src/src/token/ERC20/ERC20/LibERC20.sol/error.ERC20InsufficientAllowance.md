# ERC20InsufficientAllowance
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20/LibERC20.sol)

Thrown when a spender tries to spend more than their allowance.


```solidity
error ERC20InsufficientAllowance(address _spender, uint256 _allowance, uint256 _needed);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_spender`|`address`|The address attempting to spend.|
|`_allowance`|`uint256`|The current allowance.|
|`_needed`|`uint256`|The required amount to complete the transfer.|

