# RoleRevoked
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControl/LibAccessControl.sol)

Emitted when a role is revoked from an account.


```solidity
event RoleRevoked(bytes32 indexed _role, address indexed _account, address indexed _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was revoked.|
|`_account`|`address`|The account from which the role was revoked.|
|`_sender`|`address`|The account that revoked the role.|

