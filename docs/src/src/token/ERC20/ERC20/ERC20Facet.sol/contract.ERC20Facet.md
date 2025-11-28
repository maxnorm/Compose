# ERC20Facet
[Git Source](https://github.com/maxnorm/Compose/blob/4c4748fcb0d24a68579be4c02891d5ceb2800314/src/token/ERC20/ERC20/ERC20Facet.sol)


## State Variables
### STORAGE_POSITION
Storage position determined by the keccak256 hash of the diamond storage identifier.


```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc20")
```


## Functions
### getStorage

Returns the ERC20 storage struct from the predefined diamond storage slot.

Uses inline assembly to set the storage slot reference.


```solidity
function getStorage() internal pure returns (ERC20Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC20Storage`|The ERC20 storage struct reference.|


### name

Returns the name of the token.


```solidity
function name() external view returns (string memory);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`string`|The token name.|


### symbol

Returns the symbol of the token.


```solidity
function symbol() external view returns (string memory);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`string`|The token symbol.|


### decimals

Returns the number of decimals used for token precision.


```solidity
function decimals() external view returns (uint8);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint8`|The number of decimals.|


### totalSupply

Returns the total supply of tokens.


```solidity
function totalSupply() external view returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The total token supply.|


### balanceOf

Returns the balance of a specific account.


```solidity
function balanceOf(address _account) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_account`|`address`|The address of the account.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The account balance.|


### allowance

Returns the remaining number of tokens that a spender is allowed to spend on behalf of an owner.


```solidity
function allowance(address _owner, address _spender) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address of the token owner.|
|`_spender`|`address`|The address of the spender.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The remaining allowance.|


### approve

Approves a spender to transfer up to a certain amount of tokens on behalf of the caller.

Emits an [Approval](/src/token/ERC20/ERC20/ERC20Facet.sol/contract.ERC20Facet.md#approval) event.


```solidity
function approve(address _spender, uint256 _value) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_spender`|`address`|The address approved to spend tokens.|
|`_value`|`uint256`|The number of tokens to approve.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the approval was successful.|


### transfer

Transfers tokens to another address.

Emits a [Transfer](/src/token/ERC20/ERC20/ERC20Facet.sol/contract.ERC20Facet.md#transfer) event.


```solidity
function transfer(address _to, uint256 _value) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The address to receive the tokens.|
|`_value`|`uint256`|The amount of tokens to transfer.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the transfer was successful.|


### transferFrom

Transfers tokens on behalf of another account, provided sufficient allowance exists.

Emits a [Transfer](/src/token/ERC20/ERC20/ERC20Facet.sol/contract.ERC20Facet.md#transfer) event and decreases the spender's allowance.


```solidity
function transferFrom(address _from, address _to, uint256 _value) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address to transfer tokens from.|
|`_to`|`address`|The address to transfer tokens to.|
|`_value`|`uint256`|The amount of tokens to transfer.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the transfer was successful.|


## Events
### Approval
Emitted when an approval is made for a spender by an owner.


```solidity
event Approval(address indexed _owner, address indexed _spender, uint256 _value);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address granting the allowance.|
|`_spender`|`address`|The address receiving the allowance.|
|`_value`|`uint256`|The amount approved.|

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
### ERC20InsufficientBalance
Thrown when an account has insufficient balance for a transfer or burn.


```solidity
error ERC20InsufficientBalance(address _sender, uint256 _balance, uint256 _needed);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|Address attempting the transfer.|
|`_balance`|`uint256`|Current balance of the sender.|
|`_needed`|`uint256`|Amount required to complete the operation.|

### ERC20InvalidSender
Thrown when the sender address is invalid (e.g., zero address).


```solidity
error ERC20InvalidSender(address _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|Invalid sender address.|

### ERC20InvalidReceiver
Thrown when the receiver address is invalid (e.g., zero address).


```solidity
error ERC20InvalidReceiver(address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|Invalid receiver address.|

### ERC20InsufficientAllowance
Thrown when a spender tries to use more than the approved allowance.


```solidity
error ERC20InsufficientAllowance(address _spender, uint256 _allowance, uint256 _needed);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_spender`|`address`|Address attempting to spend.|
|`_allowance`|`uint256`|Current allowance for the spender.|
|`_needed`|`uint256`|Amount required to complete the operation.|

### ERC20InvalidSpender
Thrown when the spender address is invalid (e.g., zero address).


```solidity
error ERC20InvalidSpender(address _spender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_spender`|`address`|Invalid spender address.|

## Structs
### ERC20Storage
ERC-8042 compliant storage struct for ERC20 token data.

**Note:**
storage-location: erc8042:compose.erc20


```solidity
struct ERC20Storage {
    mapping(address owner => uint256 balance) balanceOf;
    uint256 totalSupply;
    mapping(address owner => mapping(address spender => uint256 allowance)) allowance;
    uint8 decimals;
    string name;
    string symbol;
}
```

