# revokeTemporalRole
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlTemporal/LibAccessControlTemporal.sol)

function to revoke a temporal role.


```solidity
function revokeTemporalRole(bytes32 _role, address _account) returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to revoke.|
|`_account`|`address`|The account to revoke the role from.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the role was revoked, false otherwise.|


