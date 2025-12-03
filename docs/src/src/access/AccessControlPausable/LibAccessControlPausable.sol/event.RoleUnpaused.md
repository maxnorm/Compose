# RoleUnpaused
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlPausable/LibAccessControlPausable.sol)

Event emitted when a role is unpaused.


```solidity
event RoleUnpaused(bytes32 indexed _role, address indexed _account);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was unpaused.|
|`_account`|`address`|The account that unpaused the role.|

