# RoleGranted
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControl/LibAccessControl.sol)

Emitted when a role is granted to an account.


```solidity
event RoleGranted(bytes32 indexed _role, address indexed _account, address indexed _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was granted.|
|`_account`|`address`|The account that was granted the role.|
|`_sender`|`address`|The sender that granted the role.|

