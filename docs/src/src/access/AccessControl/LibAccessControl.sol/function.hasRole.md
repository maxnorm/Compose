# hasRole
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControl/LibAccessControl.sol)

function to check if an account has a role.


```solidity
function hasRole(bytes32 _role, address _account) view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to check.|
|`_account`|`address`|The account to check the role for.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the account has the role, false otherwise.|


