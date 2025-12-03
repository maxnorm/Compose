# ERC20InvalidReceiver
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20/LibERC20.sol)

Thrown when the receiver address is invalid (e.g., zero address).


```solidity
error ERC20InvalidReceiver(address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The invalid receiver address.|

