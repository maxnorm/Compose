# DiamondCutFacet
[Git Source](https://github.com/maxnorm/Compose/blob/e3e377cf3d77e94dc30e10812da2bdd1907ca159/src/diamond/DiamondCutFacet.sol)


## State Variables
### OWNER_STORAGE_POSITION

```solidity
bytes32 constant OWNER_STORAGE_POSITION = keccak256("compose.owner")
```


### DIAMOND_STORAGE_POSITION

```solidity
bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("compose.diamond")
```


## Functions
### getOwnerStorage

Returns a pointer to the owner storage struct.

Uses inline assembly to access the storage slot defined by STORAGE_POSITION.


```solidity
function getOwnerStorage() internal pure returns (OwnerStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`OwnerStorage`|The OwnerStorage struct in storage.|


### getDiamondStorage


```solidity
function getDiamondStorage() internal pure returns (DiamondStorage storage s);
```

### addFunctions


```solidity
function addFunctions(address _facet, bytes4[] calldata _functionSelectors) internal;
```

### replaceFunctions


```solidity
function replaceFunctions(address _facet, bytes4[] calldata _functionSelectors) internal;
```

### removeFunctions


```solidity
function removeFunctions(address _facet, bytes4[] calldata _functionSelectors) internal;
```

### diamondCut

Add/replace/remove any number of functions and optionally execute
a function with delegatecall


```solidity
function diamondCut(FacetCut[] calldata _diamondCut, address _init, bytes calldata _calldata) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_diamondCut`|`FacetCut[]`|Contains the facet addresses and function selectors|
|`_init`|`address`|The address of the contract or facet to execute _calldata|
|`_calldata`|`bytes`|A function call, including function selector and arguments _calldata is executed with delegatecall on _init|


## Events
### DiamondCut

```solidity
event DiamondCut(FacetCut[] _diamondCut, address _init, bytes _calldata);
```

## Errors
### OwnerUnauthorizedAccount
Thrown when a non-owner attempts an action restricted to owner.


```solidity
error OwnerUnauthorizedAccount();
```

### NoSelectorsProvidedForFacet

```solidity
error NoSelectorsProvidedForFacet(address _facet);
```

### NoBytecodeAtAddress

```solidity
error NoBytecodeAtAddress(address _contractAddress, string _message);
```

### RemoveFacetAddressMustBeZeroAddress

```solidity
error RemoveFacetAddressMustBeZeroAddress(address _facet);
```

### IncorrectFacetCutAction

```solidity
error IncorrectFacetCutAction(uint8 _action);
```

### CannotAddFunctionToDiamondThatAlreadyExists

```solidity
error CannotAddFunctionToDiamondThatAlreadyExists(bytes4 _selector);
```

### CannotReplaceImmutableFunction

```solidity
error CannotReplaceImmutableFunction(bytes4 _selector);
```

### CannotReplaceFunctionWithTheSameFunctionFromTheSameFacet

```solidity
error CannotReplaceFunctionWithTheSameFunctionFromTheSameFacet(bytes4 _selector);
```

### CannotReplaceFunctionThatDoesNotExists

```solidity
error CannotReplaceFunctionThatDoesNotExists(bytes4 _selector);
```

### CannotRemoveFunctionThatDoesNotExist

```solidity
error CannotRemoveFunctionThatDoesNotExist(bytes4 _selector);
```

### CannotRemoveImmutableFunction

```solidity
error CannotRemoveImmutableFunction(bytes4 _selector);
```

### InitializationFunctionReverted

```solidity
error InitializationFunctionReverted(address _initializationContractAddress, bytes _calldata);
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

### FacetAndPosition
Data stored for each function selector

Facet address of function selector
Position of selector in the 'bytes4[] selectors' array


```solidity
struct FacetAndPosition {
    address facet;
    uint16 position;
}
```

### DiamondStorage
**Note:**
storage-location: erc8042:compose.diamond


```solidity
struct DiamondStorage {
    mapping(bytes4 functionSelector => FacetAndPosition) facetAndPosition;
    // Array of all function selectors that can be called in the diamond
    bytes4[] selectors;
}
```

### FacetCut
Change in diamond

facetAddress, the address of the facet containing the function selectors
action, the type of action to perform on the functions (Add/Replace/Remove)
functionSelectors, the selectors of the functions to add/replace/remove


```solidity
struct FacetCut {
    address facetAddress;
    FacetCutAction action;
    bytes4[] functionSelectors;
}
```

## Enums
### FacetCutAction
Add=0, Replace=1, Remove=2


```solidity
enum FacetCutAction {
    Add,
    Replace,
    Remove
}
```

