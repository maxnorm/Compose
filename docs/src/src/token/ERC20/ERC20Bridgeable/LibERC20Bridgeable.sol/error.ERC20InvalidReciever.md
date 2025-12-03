# ERC20InvalidReciever
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Bridgeable/LibERC20Bridgeable.sol)

/// @dev Uses ERC-8042 for storage location standardization and ERC-6093 for error conventions

Revert when a provided receiver is invalid(e.g,zero address) .


```solidity
error ERC20InvalidReciever(address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The invalid reciever address.|

