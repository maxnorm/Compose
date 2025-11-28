# AccessControlFacet
[Git Source](https://github.com/maxnorm/Compose/blob/ff0903436c4e0119526128efec4dad880d20e793/src/access/AccessControl/AccessControlFacet.sol)


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
function getStorage() internal pure returns (AccessControlStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`AccessControlStorage`|The storage for the AccessControl.|


### hasRole

Returns if an account has a role.


```solidity
function hasRole(bytes32 _role, address _account) external view returns (bool);
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


### requireRole

Checks if an account has a required role.

**Note:**
error: AccessControlUnauthorizedAccount If the account does not have the role.


```solidity
function requireRole(bytes32 _role, address _account) external view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to check.|
|`_account`|`address`|The account to check the role for.|


### getRoleAdmin

Returns the admin role for a role.


```solidity
function getRoleAdmin(bytes32 _role) external view returns (bytes32);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to get the admin for.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes32`|The admin role for the role.|


### setRoleAdmin

Sets the admin role for a role.

Emits a [RoleAdminChanged](/src/access/AccessControl/AccessControlFacet.sol/contract.AccessControlFacet.md#roleadminchanged) event.

**Note:**
error: AccessControlUnauthorizedAccount If the caller is not the current admin of the role.


```solidity
function setRoleAdmin(bytes32 _role, bytes32 _adminRole) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to set the admin for.|
|`_adminRole`|`bytes32`|The new admin role to set.|


### grantRole

Grants a role to an account.

Emits a [RoleGranted](/src/access/AccessControl/AccessControlFacet.sol/contract.AccessControlFacet.md#rolegranted) event.

**Note:**
error: AccessControlUnauthorizedAccount If the caller is not the admin of the role.


```solidity
function grantRole(bytes32 _role, address _account) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to grant.|
|`_account`|`address`|The account to grant the role to.|


### revokeRole

Revokes a role from an account.

Emits a [RoleRevoked](/src/access/AccessControl/AccessControlFacet.sol/contract.AccessControlFacet.md#rolerevoked) event.

**Note:**
error: AccessControlUnauthorizedAccount If the caller is not the admin of the role.


```solidity
function revokeRole(bytes32 _role, address _account) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to revoke.|
|`_account`|`address`|The account to revoke the role from.|


### grantRoleBatch

Grants a role to multiple accounts in a single transaction.

Emits a [RoleGranted](/src/access/AccessControl/AccessControlFacet.sol/contract.AccessControlFacet.md#rolegranted) event for each newly granted account.

**Note:**
error: AccessControlUnauthorizedAccount If the caller is not the admin of the role.


```solidity
function grantRoleBatch(bytes32 _role, address[] calldata _accounts) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to grant.|
|`_accounts`|`address[]`|The accounts to grant the role to.|


### revokeRoleBatch

Revokes a role from multiple accounts in a single transaction.

Emits a [RoleRevoked](/src/access/AccessControl/AccessControlFacet.sol/contract.AccessControlFacet.md#rolerevoked) event for each account the role is revoked from.

**Note:**
error: AccessControlUnauthorizedAccount If the caller is not the admin of the role.


```solidity
function revokeRoleBatch(bytes32 _role, address[] calldata _accounts) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to revoke.|
|`_accounts`|`address[]`|The accounts to revoke the role from.|


### renounceRole

Renounces a role from the caller.

Emits a [RoleRevoked](/src/access/AccessControl/AccessControlFacet.sol/contract.AccessControlFacet.md#rolerevoked) event.

**Note:**
error: AccessControlUnauthorizedSender If the caller is not the account to renounce the role from.


```solidity
function renounceRole(bytes32 _role, address _account) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to renounce.|
|`_account`|`address`|The account to renounce the role from.|


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

### AccessControlUnauthorizedSender
Thrown when the sender is not the account to renounce the role from.


```solidity
error AccessControlUnauthorizedSender(address _sender, address _account);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|The sender that is not the account to renounce the role from.|
|`_account`|`address`|The account to renounce the role from.|

## Structs
### AccessControlStorage
storage struct for the AccessControl.


```solidity
struct AccessControlStorage {
    mapping(address account => mapping(bytes32 role => bool hasRole)) hasRole;
    mapping(bytes32 role => bytes32 adminRole) adminRole;
}
```

