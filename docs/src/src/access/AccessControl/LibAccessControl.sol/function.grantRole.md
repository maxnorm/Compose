# grantRole
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControl/LibAccessControl.sol)

function to grant a role to an account.


```solidity
function grantRole(bytes32 _role, address _account) returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to grant.|
|`_account`|`address`|The account to grant the role to.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the role was granted, false otherwise.|


