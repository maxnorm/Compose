# IERC173
[Git Source](https://github.com/maxnorm/Compose/blob/c5fa0f9e7d2d9c835414fc63aa46e9da0ac324f9/src/interfaces/IERC173.sol)

**Title:**
ERC-173 Contract Ownership Standard Interface

Interface for contract ownership with custom errors

This interface includes all custom errors used by ERC-173 implementations


## Functions
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


## Events
### OwnershipTransferred
This emits when ownership of a contract changes.


```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
```

## Errors
### OwnableUnauthorizedAccount
Thrown when attempting to transfer ownership while not being the owner.


```solidity
error OwnableUnauthorizedAccount();
```

### OwnableAlreadyRenounced
Thrown when attempting to transfer ownership of a renounced contract.


```solidity
error OwnableAlreadyRenounced();
```

