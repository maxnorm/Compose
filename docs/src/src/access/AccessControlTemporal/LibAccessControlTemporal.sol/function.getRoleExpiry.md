# getRoleExpiry
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlTemporal/LibAccessControlTemporal.sol)

function to get the expiry timestamp for a role assignment.


```solidity
function getRoleExpiry(bytes32 _role, address _account) view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to check.|
|`_account`|`address`|The account to check.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The expiry timestamp, or 0 if no expiry is set.|


