# LibRoyalty
[Git Source](https://github.com/maxnorm/Compose/blob/c5fa0f9e7d2d9c835414fc63aa46e9da0ac324f9/src/token/Royalty/LibRoyalty.sol)

**Title:**
LibRoyalty - ERC-2981 Royalty Standard Library

Provides internal functions and storage layout for ERC-2981 royalty logic.

Uses ERC-8042 for storage location standardization. Compatible with OpenZeppelin's ERC2981 behavior.
This is an implementation of the ERC-2981 NFT Royalty Standard.


## State Variables
### STORAGE_POSITION

```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc2981")
```


### FEE_DENOMINATOR
The denominator with which to interpret royalty fees as a percentage of sale price.
Expressed in basis points where 10000 = 100%. This value aligns with the ERC-2981
specification and marketplace expectations. Implemented as a constant for gas efficiency
rather than the virtual function pattern, as Compose does not support inheritance-based
customization. To modify this value, deploy a custom facet implementation.


```solidity
uint96 constant FEE_DENOMINATOR = 10000
```


## Functions
### getStorage

Returns the royalty storage struct from its predefined slot.

Uses inline assembly to access diamond storage location.


```solidity
function getStorage() internal pure returns (RoyaltyStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`RoyaltyStorage`|The storage reference for royalty state variables.|


### royaltyInfo

Queries royalty information for a given token and sale price.

Returns token-specific royalty or falls back to default royalty.
Royalty amount is calculated as a percentage of the sale price using basis points.
Implements the ERC-2981 royaltyInfo function logic.


```solidity
function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
    internal
    view
    returns (address receiver, uint256 royaltyAmount);
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


### setDefaultRoyalty

Sets the default royalty information that applies to all tokens.

Validates receiver and fee, then updates default royalty storage.


```solidity
function setDefaultRoyalty(address _receiver, uint96 _feeNumerator) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The royalty recipient address.|
|`_feeNumerator`|`uint96`|The royalty fee in basis points.|


### deleteDefaultRoyalty

Removes default royalty information.

After calling this function, royaltyInfo will return (address(0), 0) for tokens without specific royalty.


```solidity
function deleteDefaultRoyalty() internal;
```

### setTokenRoyalty

Sets royalty information for a specific token, overriding the default.

Validates receiver and fee, then updates token-specific royalty storage.


```solidity
function setTokenRoyalty(uint256 _tokenId, address _receiver, uint96 _feeNumerator) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The token ID to configure royalty for.|
|`_receiver`|`address`|The royalty recipient address.|
|`_feeNumerator`|`uint96`|The royalty fee in basis points.|


### resetTokenRoyalty

Resets royalty information for a specific token to use the default setting.

Clears token-specific royalty storage, causing fallback to default royalty.


```solidity
function resetTokenRoyalty(uint256 _tokenId) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The token ID to reset royalty configuration for.|


## Errors
### ERC2981InvalidDefaultRoyalty
Thrown when default royalty fee exceeds 100% (10000 basis points).


```solidity
error ERC2981InvalidDefaultRoyalty(uint256 _numerator, uint256 _denominator);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_numerator`|`uint256`|The fee numerator that exceeds the denominator.|
|`_denominator`|`uint256`|The fee denominator (10000 basis points).|

### ERC2981InvalidDefaultRoyaltyReceiver
Thrown when default royalty receiver is the zero address.


```solidity
error ERC2981InvalidDefaultRoyaltyReceiver(address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The invalid receiver address.|

### ERC2981InvalidTokenRoyalty
Thrown when token-specific royalty fee exceeds 100% (10000 basis points).


```solidity
error ERC2981InvalidTokenRoyalty(uint256 _tokenId, uint256 _numerator, uint256 _denominator);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The token ID with invalid royalty configuration.|
|`_numerator`|`uint256`|The fee numerator that exceeds the denominator.|
|`_denominator`|`uint256`|The fee denominator (10000 basis points).|

### ERC2981InvalidTokenRoyaltyReceiver
Thrown when token-specific royalty receiver is the zero address.


```solidity
error ERC2981InvalidTokenRoyaltyReceiver(uint256 _tokenId, address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The token ID with invalid royalty configuration.|
|`_receiver`|`address`|The invalid receiver address.|

## Structs
### RoyaltyInfo
Structure containing royalty information.


```solidity
struct RoyaltyInfo {
    address receiver;
    uint96 royaltyFraction;
}
```

**Properties**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`address`|The address that will receive royalty payments.|
|`royaltyFraction`|`uint96`|The royalty fee expressed in basis points.|

### RoyaltyStorage
**Note:**
storage-location: erc8042:compose.erc2981


```solidity
struct RoyaltyStorage {
    RoyaltyInfo defaultRoyaltyInfo;
    mapping(uint256 tokenId => RoyaltyInfo) tokenRoyaltyInfo;
}
```

