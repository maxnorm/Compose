# OwnerTwoStepsFacet
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/OwnerTwoSteps/OwnerTwoStepsFacet.sol)


## State Variables
### OWNER_STORAGE_POSITION

```solidity
bytes32 constant OWNER_STORAGE_POSITION = keccak256("compose.owner")
```


### PENDING_OWNER_STORAGE_POSITION

```solidity
bytes32 constant PENDING_OWNER_STORAGE_POSITION = keccak256("compose.owner.pending")
```


## Functions
### getOwnerStorage

Returns a pointer to the Owner storage struct.

Uses inline assembly to access the storage slot defined by OWNER_STORAGE_POSITION.


```solidity
function getOwnerStorage() internal pure returns (OwnerStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`OwnerStorage`|The OwnerStorage struct in storage.|


### getPendingOwnerStorage

Returns a pointer to the PendingOwner storage struct.

Uses inline assembly to access the storage slot defined by PENDING_OWNER_STORAGE_POSITION.


```solidity
function getPendingOwnerStorage() internal pure returns (PendingOwnerStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`PendingOwnerStorage`|The PendingOwnerStorage struct in storage.|


### owner

Get the address of the owner


```solidity
function owner() external view returns (address);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|The address of the owner.|


### pendingOwner

Get the address of the pending owner


```solidity
function pendingOwner() external view returns (address);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|The address of the pending owner.|


### transferOwnership

Set the address of the new owner of the contract


```solidity
function transferOwnership(address _newOwner) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newOwner`|`address`|The address of the new owner of the contract|


### acceptOwnership

Accept the ownership of the contract

Only the pending owner can call this function.


```solidity
function acceptOwnership() external;
```

### renounceOwnership

Renounce ownership of the contract

Sets the owner to address(0), disabling all functions restricted to the owner.


```solidity
function renounceOwnership() external;
```

## Events
### OwnershipTransferStarted
This emits when ownership of a contract started transferring to the new owner for accepting the ownership.


```solidity
event OwnershipTransferStarted(address indexed _previousOwner, address indexed _newOwner);
```

### OwnershipTransferred
This emits when ownership of a contract changes.


```solidity
event OwnershipTransferred(address indexed _previousOwner, address indexed _newOwner);
```

## Errors
### OwnerUnauthorizedAccount
Thrown when a non-owner attempts an action restricted to owner.


```solidity
error OwnerUnauthorizedAccount();
```

## Structs
### OwnerStorage
**Note:**
storage-location: erc8042:compose.owner


```solidity
struct OwnerStorage {
    address owner;
}
```

### PendingOwnerStorage
**Note:**
storage-location: erc8042:compose.owner.pending


```solidity
struct PendingOwnerStorage {
    address pendingOwner;
}
```

