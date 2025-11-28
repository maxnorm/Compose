# LibERC165
[Git Source](https://github.com/maxnorm/Compose/blob/ff0903436c4e0119526128efec4dad880d20e793/src/interfaceDetection/ERC165/LibERC165.sol)

**Title:**
LibERC165 — ERC-165 Standard Interface Detection Library

Provides internal functions and storage layout for ERC-165 interface detection.

Uses ERC-8042 for storage location standardization


## State Variables
### STORAGE_POSITION
Storage slot identifier, defined using keccak256 hash of the library diamond storage identifier.


```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc165")
```


## Functions
### getStorage

Returns a pointer to the ERC-165 storage struct.

Uses inline assembly to bind the storage struct to the fixed storage position.


```solidity
function getStorage() internal pure returns (ERC165Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC165Storage`|The ERC-165 storage struct.|


### registerInterface

Register that a contract supports an interface

Call this function during initialization to register supported interfaces.
For example, in an ERC721 facet initialization, you would call:
`LibERC165.registerInterface(type(IERC721).interfaceId)`


```solidity
function registerInterface(bytes4 _interfaceId) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_interfaceId`|`bytes4`|The interface ID to register|


## Structs
### ERC165Storage
ERC-165 storage layout using the ERC-8042 standard.

**Note:**
storage-location: erc8042:compose.erc165


```solidity
struct ERC165Storage {
    /// @notice Mapping of interface IDs to whether they are supported
    mapping(bytes4 => bool) supportedInterfaces;
}
```

