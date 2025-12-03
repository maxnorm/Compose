# IERC721Receiver
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721/ERC721Facet.sol)

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


