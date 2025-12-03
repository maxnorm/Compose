# requireRole
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControl/LibAccessControl.sol)

function to check if an account has a required role.

**Note:**
error: AccessControlUnauthorizedAccount If the account does not have the role.


```solidity
function requireRole(bytes32 _role, address _account) view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to assert.|
|`_account`|`address`|The account to assert the role for.|


