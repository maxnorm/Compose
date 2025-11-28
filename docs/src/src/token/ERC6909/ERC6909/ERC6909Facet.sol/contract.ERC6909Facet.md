# ERC6909Facet
[Git Source](https://github.com/maxnorm/Compose/blob/4c4748fcb0d24a68579be4c02891d5ceb2800314/src/token/ERC6909/ERC6909/ERC6909Facet.sol)

**Title:**
ERC-6909 Minimal Multi-Token Interface

A complete, dependency-free ERC-6909 implementation using the diamond storage pattern.


## State Variables
### STORAGE_POSITION
Storage position determined by the keccak256 hash of the diamond storage identifier.


```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc6909")
```


## Functions
### getStorage

Returns a pointer to the ERC-6909 storage struct.

Uses inline assembly to access the storage slot defined by STORAGE_POSITION.


```solidity
function getStorage() internal pure returns (ERC6909Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC6909Storage`|The ERC6909Storage struct in storage.|


### balanceOf

Owner balance of an id.


```solidity
function balanceOf(address _owner, uint256 _id) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address of the owner.|
|`_id`|`uint256`|The id of the token.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The balance of the token.|


### allowance

Spender allowance of an id.


```solidity
function allowance(address _owner, address _spender, uint256 _id) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address of the owner.|
|`_spender`|`address`|The address of the spender.|
|`_id`|`uint256`|The id of the token.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The allowance of the token.|


### isOperator

Checks if a spender is approved by an owner as an operator.


```solidity
function isOperator(address _owner, address _spender) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address of the owner.|
|`_spender`|`address`|The address of the spender.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|The approval status.|


### transfer

Transfers an amount of an id from the caller to a receiver.


```solidity
function transfer(address _receiver, uint256 _id, uint256 _amount) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The address of the receiver.|
|`_id`|`uint256`|The id of the token.|
|`_amount`|`uint256`|The amount of the token.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|Whether the transfer succeeded.|


### transferFrom

Transfers an amount of an id from a sender to a receiver.


```solidity
function transferFrom(address _sender, address _receiver, uint256 _id, uint256 _amount) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|The address of the sender.|
|`_receiver`|`address`|The address of the receiver.|
|`_id`|`uint256`|The id of the token.|
|`_amount`|`uint256`|The amount of the token.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|Whether the transfer succeeded.|


### approve

Approves an amount of an id to a spender.


```solidity
function approve(address _spender, uint256 _id, uint256 _amount) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_spender`|`address`|The address of the spender.|
|`_id`|`uint256`|The id of the token.|
|`_amount`|`uint256`|The amount of the token.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|Whether the approval succeeded.|


### setOperator

Sets or removes a spender as an operator for the caller.


```solidity
function setOperator(address _spender, bool _approved) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_spender`|`address`|The address of the spender.|
|`_approved`|`bool`|The approval status.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|Whether the operator update succeeded.|


## Events
### Transfer
Emitted when a transfer occurs.


```solidity
event Transfer(
    address _caller, address indexed _sender, address indexed _receiver, uint256 indexed _id, uint256 _amount
);
```

### OperatorSet
Emitted when an operator is set.


```solidity
event OperatorSet(address indexed _owner, address indexed _spender, bool _approved);
```

### Approval
Emitted when an approval occurs.


```solidity
event Approval(address indexed _owner, address indexed _spender, uint256 indexed _id, uint256 _amount);
```

## Errors
### ERC6909InsufficientBalance
Thrown when the sender has insufficient balance.


```solidity
error ERC6909InsufficientBalance(address _sender, uint256 _balance, uint256 _needed, uint256 _id);
```

### ERC6909InsufficientAllowance
Thrown when the spender has insufficient allowance.


```solidity
error ERC6909InsufficientAllowance(address _spender, uint256 _allowance, uint256 _needed, uint256 _id);
```

### ERC6909InvalidReceiver
Thrown when the receiver address is invalid.


```solidity
error ERC6909InvalidReceiver(address _receiver);
```

### ERC6909InvalidSender
Thrown when the sender address is invalid.


```solidity
error ERC6909InvalidSender(address _sender);
```

### ERC6909InvalidSpender
Thrown when the spender address is invalid.


```solidity
error ERC6909InvalidSpender(address _spender);
```

## Structs
### ERC6909Storage
**Note:**
storage-location: erc8042:compose.erc6909


```solidity
struct ERC6909Storage {
    mapping(address owner => mapping(uint256 id => uint256 amount)) balanceOf;
    mapping(address owner => mapping(address spender => mapping(uint256 id => uint256 amount))) allowance;
    mapping(address owner => mapping(address spender => bool)) isOperator;
}
```

