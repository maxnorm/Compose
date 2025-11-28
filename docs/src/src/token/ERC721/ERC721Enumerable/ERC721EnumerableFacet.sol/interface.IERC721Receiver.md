# IERC721Receiver
[Git Source](https://github.com/maxnorm/Compose/blob/6956906c9ed86d52ca90b8f2deea310beff37f02/src/token/ERC721/ERC721Enumerable/ERC721EnumerableFacet.sol)

**Title:**
ERC721 Receiver Interface

Interface for contracts that want to support safe ERC721 token transfers.

Implementers must return the function selector to confirm token receipt.


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
|`_operator`|`address`|The address which initiated the transfer.|
|`_from`|`address`|The previous owner of the token.|
|`_tokenId`|`uint256`|The NFT identifier being transferred.|
|`_data`|`bytes`|Additional data with no specified format.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes4`|A bytes4 value indicating acceptance of the transfer.|


