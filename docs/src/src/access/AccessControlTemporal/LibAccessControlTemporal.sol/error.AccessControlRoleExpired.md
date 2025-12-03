# AccessControlRoleExpired
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlTemporal/LibAccessControlTemporal.sol)

Thrown when a role has expired.


```solidity
error AccessControlRoleExpired(bytes32 _role, address _account);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that has expired.|
|`_account`|`address`|The account whose role has expired.|

