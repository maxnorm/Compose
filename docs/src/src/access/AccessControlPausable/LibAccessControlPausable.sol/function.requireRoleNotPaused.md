# requireRoleNotPaused
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlPausable/LibAccessControlPausable.sol)

function to check if an account has a role and if the role is not paused.

**Notes:**
- error: AccessControlUnauthorizedAccount If the account does not have the role.

- error: AccessControlRolePaused If the role is paused.


```solidity
function requireRoleNotPaused(bytes32 _role, address _account) view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to check.|
|`_account`|`address`|The account to check the role for.|


