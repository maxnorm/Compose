# ERC20InsufficientBalance
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20/LibERC20.sol)

Thrown when a sender attempts to transfer or burn more tokens than their balance.


```solidity
error ERC20InsufficientBalance(address _sender, uint256 _balance, uint256 _needed);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|The address attempting the transfer or burn.|
|`_balance`|`uint256`|The sender's current balance.|
|`_needed`|`uint256`|The amount required to complete the operation.|

