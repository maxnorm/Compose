# LibAccessControlPausable
[Git Source](https://github.com/maxnorm/Compose/blob/e3e377cf3d77e94dc30e10812da2bdd1907ca159/src/access/AccessControlPausable/LibAccessControlPausable.sol)


## State Variables
### ACCESS_CONTROL_STORAGE_POSITION
Storage slot identifier for AccessControl (reused to access roles).


```solidity
bytes32 constant ACCESS_CONTROL_STORAGE_POSITION = keccak256("compose.accesscontrol")
```


### PAUSABLE_STORAGE_POSITION
Storage slot identifier for Pausable functionality.


```solidity
bytes32 constant PAUSABLE_STORAGE_POSITION = keccak256("compose.accesscontrol.pausable")
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

Returns the storage for AccessControlPausable.


```solidity
function getStorage() internal pure returns (AccessControlPausableStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`AccessControlPausableStorage`|The AccessControlPausable storage struct.|


### isRolePaused

function to check if a role is paused.


```solidity
function isRolePaused(bytes32 _role) internal view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to check.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the role is paused, false otherwise.|


### pauseRole

function to pause a role.


```solidity
function pauseRole(bytes32 _role) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to pause.|


### unpauseRole

function to unpause a role.


```solidity
function unpauseRole(bytes32 _role) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to unpause.|


### requireRoleNotPaused

function to check if an account has a role and if the role is not paused.

**Notes:**
- error: AccessControlUnauthorizedAccount If the account does not have the role.

- error: AccessControlRolePaused If the role is paused.


```solidity
function requireRoleNotPaused(bytes32 _role, address _account) internal view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role to check.|
|`_account`|`address`|The account to check the role for.|


## Events
### RolePaused
Event emitted when a role is paused.


```solidity
event RolePaused(bytes32 indexed _role, address indexed _account);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was paused.|
|`_account`|`address`|The account that paused the role.|

### RoleUnpaused
Event emitted when a role is unpaused.


```solidity
event RoleUnpaused(bytes32 indexed _role, address indexed _account);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was unpaused.|
|`_account`|`address`|The account that unpaused the role.|

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

### AccessControlRolePaused
Thrown when a role is paused and an operation requiring that role is attempted.


```solidity
error AccessControlRolePaused(bytes32 _role);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that is paused.|

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

### AccessControlPausableStorage
Storage struct for AccessControlPausable.

**Note:**
storage-location: erc8042:compose.accesscontrol.pausable


```solidity
struct AccessControlPausableStorage {
    mapping(bytes32 role => bool paused) pausedRoles;
}
```

