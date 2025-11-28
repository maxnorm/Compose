# LibERC6909
[Git Source](https://github.com/maxnorm/Compose/blob/ff0903436c4e0119526128efec4dad880d20e793/src/token/ERC6909/ERC6909/LibERC6909.sol)

**Title:**
LibERC6909 — ERC-6909 Library

Provides internal functions and storage layout for ERC-6909 minimal multi-token logic.

Uses ERC-8042 for storage location standardization.
This library is intended to be used by custom facets to integrate with ERC-6909 functionality.

Adapted from: https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC6909.sol


## State Variables
### STORAGE_POSITION
Storage position determined by the keccak256 hash of the diamond storage identifier.


```solidity
bytes32 internal constant STORAGE_POSITION = keccak256("compose.erc6909")
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


### mint

Mints `_amount` of token id `_id` to `_to`.


```solidity
function mint(address _to, uint256 _id, uint256 _amount) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The address of the receiver.|
|`_id`|`uint256`|The id of the token.|
|`_amount`|`uint256`|The amount of the token.|


### burn

Burns `_amount` of token id `_id` from `_from`.


```solidity
function burn(address _from, uint256 _id, uint256 _amount) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address of the sender.|
|`_id`|`uint256`|The id of the token.|
|`_amount`|`uint256`|The amount of the token.|


### transfer

Transfers `_amount` of token id `_id` from `_from` to `_to`.

Allowance is not deducted if it is `type(uint256).max`

Allowance is not deducted if `_by` is an operator for `_from`.


```solidity
function transfer(address _by, address _from, address _to, uint256 _id, uint256 _amount) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_by`|`address`|The address initiating the transfer.|
|`_from`|`address`|The address of the sender.|
|`_to`|`address`|The address of the receiver.|
|`_id`|`uint256`|The id of the token.|
|`_amount`|`uint256`|The amount of the token.|


### approve

Approves an amount of an id to a spender.


```solidity
function approve(address _owner, address _spender, uint256 _id, uint256 _amount) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The token owner.|
|`_spender`|`address`|The address of the spender.|
|`_id`|`uint256`|The id of the token.|
|`_amount`|`uint256`|The amount of the token.|


### setOperator

Sets or removes a spender as an operator for the caller.


```solidity
function setOperator(address _owner, address _spender, bool _approved) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address of the owner.|
|`_spender`|`address`|The address of the spender.|
|`_approved`|`bool`|The approval status.|


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

### ERC6909InvalidApprover
Thrown when the approver address is invalid.


```solidity
error ERC6909InvalidApprover(address _approver);
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

