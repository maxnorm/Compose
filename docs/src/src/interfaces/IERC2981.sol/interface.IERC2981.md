# IERC2981
[Git Source](https://github.com/maxnorm/Compose/blob/65ccb583222569a74d6694fb4ab182f734624c4c/src/interfaces/IERC2981.sol)

**Title:**
ERC-2981 NFT Royalty Standard Interface

Interface for ERC-2981 royalty information with custom errors

This interface includes all custom errors used by ERC-2981 implementations


## Functions
### royaltyInfo

Returns royalty information for a given token and sale price.

Called with the sale price to determine how much royalty is owed and to whom.
Implementations MUST calculate royalty as a percentage of the sale price.


```solidity
function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
    external
    view
    returns (address receiver, uint256 royaltyAmount);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The NFT asset queried for royalty information.|
|`_salePrice`|`uint256`|The sale price of the NFT asset specified by _tokenId.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`address`|The address designated to receive the royalty payment.|
|`royaltyAmount`|`uint256`|The royalty payment amount for _salePrice.|


## Errors
### ERC2981InvalidDefaultRoyalty
Error indicating the default royalty fee exceeds 100% (10000 basis points).


```solidity
error ERC2981InvalidDefaultRoyalty(uint256 _numerator, uint256 _denominator);
```

### ERC2981InvalidDefaultRoyaltyReceiver
Error indicating the default royalty receiver is the zero address.


```solidity
error ERC2981InvalidDefaultRoyaltyReceiver(address _receiver);
```

### ERC2981InvalidTokenRoyalty
Error indicating a token-specific royalty fee exceeds 100% (10000 basis points).


```solidity
error ERC2981InvalidTokenRoyalty(uint256 _tokenId, uint256 _numerator, uint256 _denominator);
```

### ERC2981InvalidTokenRoyaltyReceiver
Error indicating a token-specific royalty receiver is the zero address.


```solidity
error ERC2981InvalidTokenRoyaltyReceiver(uint256 _tokenId, address _receiver);
```

