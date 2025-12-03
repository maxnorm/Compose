# ERC6909InsufficientBalance
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC6909/ERC6909/LibERC6909.sol)

Thrown when the sender has insufficient balance.


```solidity
error ERC6909InsufficientBalance(address _sender, uint256 _balance, uint256 _needed, uint256 _id);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|The address attempting the transfer or burn.|
|`_balance`|`uint256`|The sender's current balance.|
|`_needed`|`uint256`|The amount required to complete the operation.|
|`_id`|`uint256`|The token ID.|

