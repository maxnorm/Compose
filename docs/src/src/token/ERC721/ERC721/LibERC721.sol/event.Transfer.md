# Transfer
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721/LibERC721.sol)

Emitted when ownership of a token changes, including minting and burning.


```solidity
event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address transferring the token, or zero for minting.|
|`_to`|`address`|The address receiving the token, or zero for burning.|
|`_tokenId`|`uint256`|The ID of the token being transferred.|

