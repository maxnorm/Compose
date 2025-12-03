# OperatorSet
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC6909/ERC6909/LibERC6909.sol)

Emitted when an operator is set.


```solidity
event OperatorSet(address indexed _owner, address indexed _spender, bool _approved);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The owner granting the operator status.|
|`_spender`|`address`|The address receiving operator status.|
|`_approved`|`bool`|True if the operator is approved, false otherwise.|

