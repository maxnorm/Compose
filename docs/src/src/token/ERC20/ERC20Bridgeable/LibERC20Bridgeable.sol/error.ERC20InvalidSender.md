# ERC20InvalidSender
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Bridgeable/LibERC20Bridgeable.sol)

Thrown when the sender address is invalid (e.g., zero address).


```solidity
error ERC20InvalidSender(address _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|The invalid sender address.|

