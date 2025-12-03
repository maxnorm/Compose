# RolePaused
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlPausable/LibAccessControlPausable.sol)

Event emitted when a role is paused.


```solidity
event RolePaused(bytes32 indexed _role, address indexed _account);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was paused.|
|`_account`|`address`|The account that paused the role.|

