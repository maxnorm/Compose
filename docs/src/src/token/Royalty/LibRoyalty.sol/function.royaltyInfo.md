# royaltyInfo
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

Queries royalty information for a given token and sale price.

Returns token-specific royalty or falls back to default royalty.
Royalty amount is calculated as a percentage of the sale price using basis points.
Implements the ERC-2981 royaltyInfo function logic.


```solidity
function royaltyInfo(uint256 _tokenId, uint256 _salePrice) view returns (address receiver, uint256 royaltyAmount);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The NFT asset queried for royalty information.|
|`_salePrice`|`uint256`|The sale price of the NFT asset.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`address`|The address designated to receive the royalty payment.|
|`royaltyAmount`|`uint256`|The royalty payment amount for _salePrice.|


