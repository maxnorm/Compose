# ERC20InvalidBridgeAccount
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Bridgeable/LibERC20Bridgeable.sol)

Revert when caller is not a trusted bridge.


```solidity
error ERC20InvalidBridgeAccount(address _caller);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_caller`|`address`|The unauthorized caller.|

