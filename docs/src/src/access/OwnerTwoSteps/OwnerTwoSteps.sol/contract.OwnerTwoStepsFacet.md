# OwnerTwoStepsFacet
[Git Source](https://github.com/maxnorm/Compose/blob/e3e377cf3d77e94dc30e10812da2bdd1907ca159/src/access/OwnerTwoSteps/OwnerTwoSteps.sol)


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
function getStorage() internal pure returns (OwnerTwoStepsStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`OwnerTwoStepsStorage`|The EOwnerTwoStepsStorage struct in storage.|


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
### OwnerTwoStepsStorage
**Note:**
storage-location: erc8042:compose.owner


```solidity
struct OwnerTwoStepsStorage {
    address owner;
    address pendingOwner;
}
```

