# ERC165Facet
[Git Source](https://github.com/maxnorm/Compose/blob/4c4748fcb0d24a68579be4c02891d5ceb2800314/src/interfaceDetection/ERC165/ERC165Facet.sol)

**Title:**
ERC165Facet — ERC-165 Standard Interface Detection Facet

Facet implementation of ERC-165 for diamond proxy pattern

Allows querying which interfaces are implemented by the diamond
Each facet is a standalone source code file following SCOP principles.


## State Variables
### STORAGE_POSITION
Storage slot identifier for ERC-165 interface detection

Defined using keccak256 hash following ERC-8042 standard


```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc165")
```


## Functions
### getStorage

Returns a pointer to the ERC-165 storage struct

Uses inline assembly to bind the storage struct to the fixed storage position


```solidity
function getStorage() internal pure returns (ERC165Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC165Storage`|The ERC-165 storage struct|


### supportsInterface

Query if a contract implements an interface

This function checks if the diamond supports the given interface ID


```solidity
function supportsInterface(bytes4 _interfaceId) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_interfaceId`|`bytes4`|The interface identifier, as specified in ERC-165|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|`true` if the contract implements `_interfaceId` and `_interfaceId` is not 0xffffffff, `false` otherwise|


## Structs
### ERC165Storage
ERC-165 storage layout using the ERC-8042 standard

**Note:**
storage-location: erc8042:compose.erc165


```solidity
struct ERC165Storage {
    /// @notice Mapping of interface IDs to whether they are supported
    mapping(bytes4 => bool) supportedInterfaces;
}
```

