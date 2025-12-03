# OwnerFacet
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/Owner/OwnerFacet.sol)


## State Variables
### STORAGE_POSITION

```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.owner")
```


## Functions
### getStorage

Returns a pointer to the owner storage struct.

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
function owner() external view returns (address);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|The address of the owner.|


### transferOwnership

Set the address of the new owner of the contract

Set _newOwner to address(0) to renounce any ownership.


```solidity
function transferOwnership(address _newOwner) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newOwner`|`address`|The address of the new owner of the contract|


### renounceOwnership

Renounce ownership of the contract

Sets the owner to address(0), disabling all functions restricted to the owner.


```solidity
function renounceOwnership() external;
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

## Structs
### OwnerStorage
**Note:**
storage-location: erc8042:compose.owner


```solidity
struct OwnerStorage {
    address owner;
}
```

