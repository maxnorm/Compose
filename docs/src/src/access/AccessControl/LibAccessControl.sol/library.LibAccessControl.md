# LibAccessControl
[Git Source](https://github.com/maxnorm/Compose/blob/e3e377cf3d77e94dc30e10812da2bdd1907ca159/src/access/AccessControl/LibAccessControl.sol)


## State Variables
### STORAGE_POSITION
Storage slot identifier.


```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.accesscontrol")
```


### DEFAULT_ADMIN_ROLE
Default admin role.


```solidity
bytes32 constant DEFAULT_ADMIN_ROLE = 0x00
```


## Functions
### getStorage

Returns the storage for the AccessControl.


```solidity
function getStorage() internal pure returns (AccessControlStorage storage _s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`_s`|`AccessControlStorage`|The storage for the AccessControl.|


### requireRole

function to check if an account has a required role.

**Note:**
error: AccessControlUnauthorizedAccount If the account does not have the role.


```solidity
function requireRole(bytes32 _role, address _account) internal view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to assert.|
|`_account`|`address`|The account to assert the role for.|


### hasRole

function to check if an account has a role.


```solidity
function hasRole(bytes32 _role, address _account) internal view returns (bool);
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


### setRoleAdmin

function to set the admin role for a role.


```solidity
function setRoleAdmin(bytes32 _role, bytes32 _adminRole) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to set the admin for.|
|`_adminRole`|`bytes32`|The admin role to set.|


### grantRole

function to grant a role to an account.


```solidity
function grantRole(bytes32 _role, address _account) internal returns (bool);
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


### revokeRole

function to revoke a role from an account.


```solidity
function revokeRole(bytes32 _role, address _account) internal returns (bool);
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


## Events
### RoleAdminChanged
Emitted when the admin role for a role is changed.


```solidity
event RoleAdminChanged(bytes32 indexed _role, bytes32 indexed _previousAdminRole, bytes32 indexed _newAdminRole);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was changed.|
|`_previousAdminRole`|`bytes32`|The previous admin role.|
|`_newAdminRole`|`bytes32`|The new admin role.|

### RoleGranted
Emitted when a role is granted to an account.


```solidity
event RoleGranted(bytes32 indexed _role, address indexed _account, address indexed _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was granted.|
|`_account`|`address`|The account that was granted the role.|
|`_sender`|`address`|The sender that granted the role.|

### RoleRevoked
Emitted when a role is revoked from an account.


```solidity
event RoleRevoked(bytes32 indexed _role, address indexed _account, address indexed _sender);
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

## Structs
### AccessControlStorage
storage struct for the AccessControl.

**Note:**
storage-location: erc8042:compose.accesscontrol


```solidity
struct AccessControlStorage {
    mapping(address account => mapping(bytes32 role => bool hasRole)) hasRole;
    mapping(bytes32 role => bytes32 adminRole) adminRole;
}
```

