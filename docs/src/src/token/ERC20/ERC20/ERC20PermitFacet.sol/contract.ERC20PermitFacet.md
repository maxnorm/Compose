# ERC20PermitFacet
[Git Source](https://github.com/maxnorm/Compose/blob/65ccb583222569a74d6694fb4ab182f734624c4c/src/token/ERC20/ERC20/ERC20PermitFacet.sol)


## State Variables
### ERC20_STORAGE_POSITION

```solidity
bytes32 constant ERC20_STORAGE_POSITION = keccak256("compose.erc20")
```


### STORAGE_POSITION

```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc20.permit")
```


## Functions
### getERC20Storage


```solidity
function getERC20Storage() internal pure returns (ERC20Storage storage s);
```

### getStorage


```solidity
function getStorage() internal pure returns (ERC20PermitStorage storage s);
```

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

Returns the domain separator used in the encoding of the signature for [permit](/src/token/ERC20/ERC20/ERC20PermitFacet.sol/contract.ERC20PermitFacet.md#permit).

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
The `ERC20PermitFacet` only uses the `allowance` and `name` variables inside
the `ERC20Storage` struct from `ERC20Facet`.
We cannot remove the `balanceOf`, `totalSupply`, and `decimals` variables from
the struct even though they aren't used. This is because we must maintain the
order of variables defined in structs. Only variables at the end of structs can be
removed. In this case there is only one variable at the end that isn't used and that
is the `symbol` variable so that is removed from the struct below.

**Note:**
storage-location: erc8042:compose.erc20


```solidity
struct ERC20Storage {
    mapping(address owner => uint256 balance) balanceOf;
    uint256 totalSupply;
    mapping(address owner => mapping(address spender => uint256 allowance)) allowance;
    uint8 decimals;
    string name;
}
```

### ERC20PermitStorage
**Note:**
storage-location: erc8042:compose.erc20.permit


```solidity
struct ERC20PermitStorage {
    mapping(address owner => uint256) nonces;
}
```

