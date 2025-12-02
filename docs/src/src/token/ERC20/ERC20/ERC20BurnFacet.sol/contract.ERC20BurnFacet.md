# ERC20BurnFacet
[Git Source](https://github.com/maxnorm/Compose/blob/e3e377cf3d77e94dc30e10812da2bdd1907ca159/src/token/ERC20/ERC20/ERC20BurnFacet.sol)


## State Variables
### STORAGE_POSITION

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


### burn

Burns (destroys) a specific amount of tokens from the caller's balance.

Emits a [Transfer](//home/mn/os-contribution/Compose/docs/src/src/token/ERC20/ERC20/ERC20BurnFacet.sol/contract.ERC20BurnFacet.md#transfer) event to the zero address.


```solidity
function burn(uint256 _value) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_value`|`uint256`|The amount of tokens to burn.|


### burnFrom

Burns tokens from another account, deducting from the caller's allowance.

Emits a [Transfer](//home/mn/os-contribution/Compose/docs/src/src/token/ERC20/ERC20/ERC20BurnFacet.sol/contract.ERC20BurnFacet.md#transfer) event to the zero address.


```solidity
function burnFrom(address _account, uint256 _value) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_account`|`address`|The address whose tokens will be burned.|
|`_value`|`uint256`|The amount of tokens to burn.|


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
}
```

