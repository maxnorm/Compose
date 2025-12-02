# LibOwnerTwoSteps
[Git Source](https://github.com/maxnorm/Compose/blob/e3e377cf3d77e94dc30e10812da2bdd1907ca159/src/access/OwnerTwoSteps/LibOwnerTwoSteps.sol)

Provides two-step ownership transfer logic for facets or modular contracts.


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
|`s`|`OwnerTwoStepsStorage`|The ERC173Storage struct in storage.|


### owner

Returns the current owner.


```solidity
function owner() internal view returns (address);
```

### pendingOwner

Returns the pending owner (if any).


```solidity
function pendingOwner() internal view returns (address);
```

### requireOwner

Reverts if the caller is not the owner.


```solidity
function requireOwner() internal view;
```

### transferOwnership

Initiates a two-step ownership transfer.


```solidity
function transferOwnership(address _newOwner) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newOwner`|`address`|The address of the new owner of the contract|


### acceptOwnership

Finalizes ownership transfer; must be called by the pending owner.


```solidity
function acceptOwnership() internal;
```

### renounceOwnership

Renounce ownership of the contract

Sets the owner to address(0), disabling all functions restricted to the owner.


```solidity
function renounceOwnership() internal;
```

## Events
### OwnershipTransferStarted
Emitted when ownership transfer is initiated (pending owner set).


```solidity
event OwnershipTransferStarted(address indexed _previousOwner, address indexed _newOwner);
```

### OwnershipTransferred
Emitted when ownership transfer is finalized.


```solidity
event OwnershipTransferred(address indexed _previousOwner, address indexed _newOwner);
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
### OwnerTwoStepsStorage
**Note:**
storage-location: erc8042:compose.owner


```solidity
struct OwnerTwoStepsStorage {
    address owner;
    address pendingOwner;
}
```

