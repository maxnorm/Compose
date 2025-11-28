# LibOwner
[Git Source](https://github.com/maxnorm/Compose/blob/4c4748fcb0d24a68579be4c02891d5ceb2800314/src/access/Owner/LibOwner.sol)

**Title:**
ERC-173 Contract Ownership

Provides internal functions and storage layout for owner management.


## State Variables
### STORAGE_POSITION

```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.owner")
```


## Functions
### getStorage

Returns a pointer to the ERC-173 storage struct.

Uses inline assembly to access the storage slot defined by STORAGE_POSITION.


```solidity
function getStorage() internal pure returns (OwnerStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`OwnerStorage`|The OwnerStorage struct in storage.|


### owner

Get the address of the owner


```solidity
function owner() internal view returns (address);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|The address of the owner.|


### requireOwner

Reverts if the caller is not the owner.


```solidity
function requireOwner() internal view;
```

### transferOwnership

Set the address of the new owner of the contract

Set _newOwner to address(0) to renounce any ownership.


```solidity
function transferOwnership(address _newOwner) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newOwner`|`address`|The address of the new owner of the contract|


### renounceOwnership

Renounce ownership of the contract

Sets the owner to address(0), disabling all functions restricted to the owner.


```solidity
function renounceOwnership() internal;
```

## Events
### OwnershipTransferred
This emits when ownership of a contract changes.


```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
```

## Errors
### OwnerUnauthorizedAccount
Thrown when a non-owner attempts an action restricted to owner.


```solidity
error OwnerUnauthorizedAccount();
```

### OwnerAlreadyRenounced
Thrown when attempting to transfer ownership from a renounced state.


```solidity
error OwnerAlreadyRenounced();
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

