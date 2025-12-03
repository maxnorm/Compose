# AccessControlRolePaused
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlPausable/LibAccessControlPausable.sol)

Thrown when a role is paused and an operation requiring that role is attempted.


```solidity
error AccessControlRolePaused(bytes32 _role);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that is paused.|

