# grantRoleWithExpiry
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlTemporal/LibAccessControlTemporal.sol)

function to grant a role with an expiry timestamp.


```solidity
function grantRoleWithExpiry(bytes32 _role, address _account, uint256 _expiresAt) returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to grant.|
|`_account`|`address`|The account to grant the role to.|
|`_expiresAt`|`uint256`|The timestamp when the role should expire.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the role was granted, false otherwise.|


