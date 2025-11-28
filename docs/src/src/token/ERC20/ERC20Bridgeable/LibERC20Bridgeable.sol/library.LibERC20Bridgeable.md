# LibERC20Bridgeable
[Git Source](https://github.com/maxnorm/Compose/blob/c5fa0f9e7d2d9c835414fc63aa46e9da0ac324f9/src/token/ERC20/ERC20Bridgeable/LibERC20Bridgeable.sol)


## State Variables
### ERC20_STORAGE_POSITION
-----------------------------------------------------------------------
ERC20 integration (re-uses ERC20Facet storage layout)
-----------------------------------------------------------------------

Storage slot for ERC-20 token using ERC8042 for storage location standardization

Storage position determined by the keccak256 hash of the diamond storage identifier.


```solidity
bytes32 constant ERC20_STORAGE_POSITION = keccak256("compose.erc20")
```


### ACCESS_STORAGE_POSITION
-----------------------------------------------------------------------
AccessControl integration (re-uses AccessControlFacet storage layout)
-----------------------------------------------------------------------

Storage slot identifier.


```solidity
bytes32 constant ACCESS_STORAGE_POSITION = keccak256("compose.accesscontrol")
```


## Functions
### getERC20Storage

Returns the ERC20 storage struct from the predefined diamond storage slot.

Uses inline assembly to set the storage slot reference.


```solidity
function getERC20Storage() internal pure returns (ERC20Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC20Storage`|The ERC20 storage struct reference.|


### getAccessControlStorage

helper to return AccessControlStorage at its diamond slot


```solidity
function getAccessControlStorage() internal pure returns (AccessControlStorage storage s);
```

### crosschainMint

Cross-chain mint — callable only by an address having the `trusted-bridge` role.


```solidity
function crosschainMint(address _account, uint256 _value) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_account`|`address`|The account to mint tokens to.|
|`_value`|`uint256`|The amount to mint.|


### crosschainBurn

Cross-chain burn — callable only by an address having the `trusted-bridge` role.


```solidity
function crosschainBurn(address _from, uint256 _value) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The account to burn tokens from.|
|`_value`|`uint256`|The amount to burn.|


### checkTokenBridge

Internal check to check if the bridge (caller) is trusted.

Reverts if caller is zero or not in the AccessControl `trusted-bridge` role.


```solidity
function checkTokenBridge(address _caller) internal view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_caller`|`address`|The address to validate|


## Events
### CrosschainMint
Emitted when tokens are minted via a cross-chain bridge.


```solidity
event CrosschainMint(address indexed _to, uint256 _amount, address indexed _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The recipient of minted tokens.|
|`_amount`|`uint256`|The amount minted.|
|`_sender`|`address`|The bridge account that triggered the mint (msg.sender).|

### CrosschainBurn
Emitted when a crosschain transfer burns tokens.


```solidity
event CrosschainBurn(address indexed _from, uint256 _amount, address indexed _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|    Address of the account tokens are being burned from.|
|`_amount`|`uint256`|  Amount of tokens burned.|
|`_sender`|`address`|  Address of the caller (msg.sender) who invoked crosschainBurn.|

### Transfer
Emitted when tokens are transferred between two addresses.


```solidity
event Transfer(address indexed _from, address indexed _to, uint256 _value);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|Address sending the tokens.|
|`_to`|`address`|Address receiving the tokens.|
|`_value`|`uint256`|Amount of tokens transferred.|

## Errors
### ERC20InvalidReciever
Revert when a provided receiver is invalid(e.g,zero address) .


```solidity
error ERC20InvalidReciever(address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The invalid reciever address.|

### ERC20InvalidSender
Thrown when the sender address is invalid (e.g., zero address).


```solidity
error ERC20InvalidSender(address _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|The invalid sender address.|

### ERC20InvalidBridgeAccount
Revert when caller is not a trusted bridge.


```solidity
error ERC20InvalidBridgeAccount(address _caller);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_caller`|`address`|The unauthorized caller.|

### ERC20InvalidCallerAddress

```solidity
error ERC20InvalidCallerAddress(address _caller);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_caller`|`address`|is the invalid address.|

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

### ERC20InsufficientBalance

```solidity
error ERC20InsufficientBalance(address _from, uint256 _accountBalance, uint256 _value);
```

## Structs
### ERC20Storage
ERC-8042 compliant storage struct for ERC20 token data.

**Note:**
storage-location: erc8042:compose.erc20


```solidity
struct ERC20Storage {
    mapping(address owner => uint256 balance) balanceOf;
    uint256 totalSupply;
}
```

### AccessControlStorage
storage struct for the AccessControl.


```solidity
struct AccessControlStorage {
    mapping(address account => mapping(bytes32 role => bool hasRole)) hasRole;
}
```

