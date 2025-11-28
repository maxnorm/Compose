# IERC165
[Git Source](https://github.com/maxnorm/Compose/blob/4c4748fcb0d24a68579be4c02891d5ceb2800314/src/interfaceDetection/ERC165/ERC165Facet.sol)

**Title:**
ERC-165 Standard Interface Detection Interface

Interface for detecting what interfaces a contract implements

ERC-165 allows contracts to publish their supported interfaces


## Functions
### supportsInterface

Query if a contract implements an interface

Interface identification is specified in ERC-165. This function
uses less than 30,000 gas.


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


