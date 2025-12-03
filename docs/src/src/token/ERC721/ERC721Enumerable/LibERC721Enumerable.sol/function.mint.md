# mint
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721Enumerable/LibERC721Enumerable.sol)

Mints a new ERC-721 token to the specified address, adding it to enumeration lists.

Reverts if the receiver address is zero or if the token already exists.


```solidity
function mint(address _to, uint256 _tokenId) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The address that will own the newly minted token.|
|`_tokenId`|`uint256`|The ID of the token to mint.|


