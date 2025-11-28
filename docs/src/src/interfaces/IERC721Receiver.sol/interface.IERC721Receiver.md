# IERC721Receiver
[Git Source](https://github.com/maxnorm/Compose/blob/4c4748fcb0d24a68579be4c02891d5ceb2800314/src/interfaces/IERC721Receiver.sol)

**Title:**
ERC-721 Token Receiver Interface

Interface for contracts that want to handle safe transfers of ERC-721 tokens.

Contracts implementing this must return the selector to confirm token receipt.


## Functions
### onERC721Received

Handles the receipt of an NFT.


```solidity
function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes calldata _data)
    external
    returns (bytes4);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address which called `safeTransferFrom`.|
|`_from`|`address`|The previous owner of the token.|
|`_tokenId`|`uint256`|The NFT identifier being transferred.|
|`_data`|`bytes`|Additional data with no specified format.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes4`|The selector to confirm the token transfer.|


