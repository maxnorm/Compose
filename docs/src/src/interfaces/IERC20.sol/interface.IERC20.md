# IERC20
[Git Source](https://github.com/maxnorm/Compose/blob/6956906c9ed86d52ca90b8f2deea310beff37f02/src/interfaces/IERC20.sol)

**Title:**
ERC-20 Token Standard Interface

Interface for ERC-20 token contracts with custom errors

This interface includes all custom errors used by ERC-20 implementations


## Functions
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

Emits an [Approval](/src/interfaces/IERC20.sol/interface.IERC20.md#approval) event.


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
|`<none>`|`bool`|True if the operation succeeded.|


### transfer

Transfers tokens to another address.

Emits a [Transfer](/src/interfaces/IERC20.sol/interface.IERC20.md#transfer) event.


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
|`<none>`|`bool`|True if the operation succeeded.|


### transferFrom

Transfers tokens on behalf of another account, provided sufficient allowance exists.

Emits a [Transfer](/src/interfaces/IERC20.sol/interface.IERC20.md#transfer) event and decreases the spender's allowance.


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
|`<none>`|`bool`|True if the operation succeeded.|


### burn

Burns (destroys) a specific amount of tokens from the caller's balance.

Emits a [Transfer](/src/interfaces/IERC20.sol/interface.IERC20.md#transfer) event to the zero address.


```solidity
function burn(uint256 _value) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_value`|`uint256`|The amount of tokens to burn.|


### burnFrom

Burns tokens from another account, deducting from the caller's allowance.

Emits a [Transfer](/src/interfaces/IERC20.sol/interface.IERC20.md#transfer) event to the zero address.


```solidity
function burnFrom(address _account, uint256 _value) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_account`|`address`|The address whose tokens will be burned.|
|`_value`|`uint256`|The amount of tokens to burn.|


### nonces

Returns the current nonce for an owner.

This value changes each time a permit is used.


```solidity
function nonces(address _owner) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address of the owner.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The current nonce.|


### DOMAIN_SEPARATOR

Returns the domain separator used in the encoding of the signature for [permit](/src/interfaces/IERC20.sol/interface.IERC20.md#permit).

This value is unique to a contract and chain ID combination to prevent replay attacks.


```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes32`|The domain separator.|


### permit

Sets the allowance for a spender via a signature.

This function implements EIP-2612 permit functionality.


```solidity
function permit(
    address _owner,
    address _spender,
    uint256 _value,
    uint256 _deadline,
    uint8 _v,
    bytes32 _r,
    bytes32 _s
) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address of the token owner.|
|`_spender`|`address`|The address of the spender.|
|`_value`|`uint256`|The amount of tokens to approve.|
|`_deadline`|`uint256`|The deadline for the permit (timestamp).|
|`_v`|`uint8`|The recovery byte of the signature.|
|`_r`|`bytes32`|The r value of the signature.|
|`_s`|`bytes32`|The s value of the signature.|


## Events
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

### ERC2612InvalidSignature
Thrown when a permit signature is invalid or expired.


```solidity
error ERC2612InvalidSignature(
    address _owner, address _spender, uint256 _value, uint256 _deadline, uint8 _v, bytes32 _r, bytes32 _s
);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address that signed the permit.|
|`_spender`|`address`|The address that was approved.|
|`_value`|`uint256`|The amount that was approved.|
|`_deadline`|`uint256`|The deadline for the permit.|
|`_v`|`uint8`|The recovery byte of the signature.|
|`_r`|`bytes32`|The r value of the signature.|
|`_s`|`bytes32`|The s value of the signature.|

