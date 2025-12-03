# ERC20InvalidSpender
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20/LibERC20.sol)

Thrown when the spender address is invalid (e.g., zero address).


```solidity
error ERC20InvalidSpender(address _spender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_spender`|`address`|The invalid spender address.|

