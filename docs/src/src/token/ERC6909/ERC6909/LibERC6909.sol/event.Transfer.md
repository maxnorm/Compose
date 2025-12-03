# Transfer
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC6909/ERC6909/LibERC6909.sol)

Emitted when a transfer occurs.


```solidity
event Transfer(
address _caller, address indexed _sender, address indexed _receiver, uint256 indexed _id, uint256 _amount
);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_caller`|`address`|The caller who initiated the transfer.|
|`_sender`|`address`|The address from which tokens are transferred.|
|`_receiver`|`address`|The address to which tokens are transferred.|
|`_id`|`uint256`|The token ID.|
|`_amount`|`uint256`|The number of tokens transferred.|

