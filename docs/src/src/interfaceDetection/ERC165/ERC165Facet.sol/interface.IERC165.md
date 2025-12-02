# IERC165
[Git Source](https://github.com/maxnorm/Compose/blob/e3e377cf3d77e94dc30e10812da2bdd1907ca159/src/interfaceDetection/ERC165/ERC165Facet.sol)

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


