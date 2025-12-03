# transferFrom
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721Enumerable/LibERC721Enumerable.sol)

Transfers a token ID from one address to another, updating enumeration data.

Validates ownership, approval, and receiver address before state updates.


```solidity
function transferFrom(address _from, address _to, uint256 _tokenId, address _sender) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The current owner of the token.|
|`_to`|`address`|The address receiving the token.|
|`_tokenId`|`uint256`|The ID of the token being transferred.|
|`_sender`|`address`|The initiator of the transfer (may be owner or approved operator).|


