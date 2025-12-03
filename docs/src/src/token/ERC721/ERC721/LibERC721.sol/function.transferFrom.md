# transferFrom
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721/LibERC721.sol)

Transfers ownership of a token ID from one address to another.

Validates ownership, approval, and receiver address before updating state.


```solidity
function transferFrom(address _from, address _to, uint256 _tokenId) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The current owner of the token.|
|`_to`|`address`|The address that will receive the token.|
|`_tokenId`|`uint256`|The ID of the token being transferred.|


