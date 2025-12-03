# RoleAdminChanged
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControl/LibAccessControl.sol)

Emitted when the admin role for a role is changed.


```solidity
event RoleAdminChanged(bytes32 indexed _role, bytes32 indexed _previousAdminRole, bytes32 indexed _newAdminRole);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was changed.|
|`_previousAdminRole`|`bytes32`|The previous admin role.|
|`_newAdminRole`|`bytes32`|The new admin role.|

