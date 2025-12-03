# AccessControlTemporalFacet
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlTemporal/AccessControlTemporalFacet.sol)


## State Variables
### ACCESS_CONTROL_STORAGE_POSITION
Storage slot identifier for AccessControl (reused to access roles).


```solidity
bytes32 constant ACCESS_CONTROL_STORAGE_POSITION = keccak256("compose.accesscontrol")
```


### TEMPORAL_STORAGE_POSITION
Storage slot identifier for Temporal functionality.


```solidity
bytes32 constant TEMPORAL_STORAGE_POSITION = keccak256("compose.accesscontrol.temporal")
```


## Functions
### getAccessControlStorage

Returns the storage for AccessControl.


```solidity
function getAccessControlStorage() internal pure returns (AccessControlStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`AccessControlStorage`|The AccessControl storage struct.|


### getStorage

Returns the storage for AccessControlTemporal.


```solidity
function getStorage() internal pure returns (AccessControlTemporalStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`AccessControlTemporalStorage`|The AccessControlTemporal storage struct.|


### getRoleExpiry

Returns the expiry timestamp for a role assignment.


```solidity
function getRoleExpiry(bytes32 _role, address _account) external view returns (uint256);
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


### isRoleExpired

Checks if a role assignment has expired.


```solidity
function isRoleExpired(bytes32 _role, address _account) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to check.|
|`_account`|`address`|The account to check.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the role has expired or doesn't exist, false if still valid.|


### grantRoleWithExpiry

Grants a role to an account with an expiry timestamp.

Only the admin of the role can grant it with expiry.
Emits a [RoleGrantedWithExpiry](//home/mn/os-contribution/Compose/docs/src/src/access/AccessControlTemporal/AccessControlTemporalFacet.sol/contract.AccessControlTemporalFacet.md#rolegrantedwithexpiry) event.

**Note:**
error: AccessControlUnauthorizedAccount If the caller is not the admin of the role.


```solidity
function grantRoleWithExpiry(bytes32 _role, address _account, uint256 _expiresAt) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to grant.|
|`_account`|`address`|The account to grant the role to.|
|`_expiresAt`|`uint256`|The timestamp when the role should expire (must be in the future).|


### revokeTemporalRole

Revokes a temporal role from an account.

Only the admin of the role can revoke it.
Emits a [TemporalRoleRevoked](//home/mn/os-contribution/Compose/docs/src/src/access/AccessControlTemporal/AccessControlTemporalFacet.sol/contract.AccessControlTemporalFacet.md#temporalrolerevoked) event.

**Note:**
error: AccessControlUnauthorizedAccount If the caller is not the admin of the role.


```solidity
function revokeTemporalRole(bytes32 _role, address _account) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to revoke.|
|`_account`|`address`|The account to revoke the role from.|


### requireValidRole

Checks if an account has a valid (non-expired) role.

**Notes:**
- error: AccessControlUnauthorizedAccount If the account does not have the role.

- error: AccessControlRoleExpired If the role has expired.


```solidity
function requireValidRole(bytes32 _role, address _account) external view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to check.|
|`_account`|`address`|The account to check the role for.|


## Events
### RoleGrantedWithExpiry
Event emitted when a role is granted with an expiry timestamp.


```solidity
event RoleGrantedWithExpiry(
    bytes32 indexed _role, address indexed _account, uint256 _expiresAt, address indexed _sender
);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was granted.|
|`_account`|`address`|The account that was granted the role.|
|`_expiresAt`|`uint256`|The timestamp when the role expires.|
|`_sender`|`address`|The account that granted the role.|

### TemporalRoleRevoked
Event emitted when a temporal role is revoked.


```solidity
event TemporalRoleRevoked(bytes32 indexed _role, address indexed _account, address indexed _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was revoked.|
|`_account`|`address`|The account from which the role was revoked.|
|`_sender`|`address`|The account that revoked the role.|

## Errors
### AccessControlUnauthorizedAccount
Thrown when the account does not have a specific role.


```solidity
error AccessControlUnauthorizedAccount(address _account, bytes32 _role);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_account`|`address`|The account that does not have the role.|
|`_role`|`bytes32`|The role that the account does not have.|

### AccessControlRoleExpired
Thrown when a role has expired.


```solidity
error AccessControlRoleExpired(bytes32 _role, address _account);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that has expired.|
|`_account`|`address`|The account whose role has expired.|

## Structs
### AccessControlStorage
Storage struct for AccessControl (reused struct definition).

Must match the struct definition in AccessControlFacet.

**Note:**
storage-location: erc8042:compose.accesscontrol


```solidity
struct AccessControlStorage {
    mapping(address account => mapping(bytes32 role => bool hasRole)) hasRole;
    mapping(bytes32 role => bytes32 adminRole) adminRole;
}
```

### AccessControlTemporalStorage
Storage struct for AccessControlTemporal.

**Note:**
storage-location: erc8042:compose.accesscontrol.temporal


```solidity
struct AccessControlTemporalStorage {
    mapping(address account => mapping(bytes32 role => uint256 expiryTimestamp)) roleExpiry;
}
```

