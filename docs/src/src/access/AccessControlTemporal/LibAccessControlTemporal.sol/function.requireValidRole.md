# requireValidRole
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlTemporal/LibAccessControlTemporal.sol)

function to check if an account has a valid (non-expired) role.

**Notes:**
- error: AccessControlUnauthorizedAccount If the account does not have the role.

- error: AccessControlRoleExpired If the role has expired.


```solidity
function requireValidRole(bytes32 _role, address _account) view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to check.|
|`_account`|`address`|The account to check the role for.|


