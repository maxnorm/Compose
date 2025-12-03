# isRolePaused
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlPausable/LibAccessControlPausable.sol)

function to check if a role is paused.


```solidity
function isRolePaused(bytes32 _role) view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to check.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the role is paused, false otherwise.|


