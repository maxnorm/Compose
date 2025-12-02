# RoyaltyFacet
[Git Source](https://github.com/maxnorm/Compose/blob/e3e377cf3d77e94dc30e10812da2bdd1907ca159/src/token/Royalty/RoyaltyFacet.sol)

Implements royalty queries for NFT secondary sales per ERC-2981 standard.

Provides standardized royalty information to NFT marketplaces and platforms.
Supports both default and per-token royalty configurations using diamond storage.
This is an implementation of the ERC-2981 NFT Royalty Standard.


## State Variables
### STORAGE_POSITION
Storage slot identifier for royalty storage.


```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc2981")
```


### FEE_DENOMINATOR
The denominator with which to interpret royalty fees as a percentage of sale price.
Expressed in basis points where 10000 = 100%. This value aligns with the ERC-2981
specification and marketplace expectations.


```solidity
uint96 constant FEE_DENOMINATOR = 10000
```


## Functions
### getStorage

Returns a pointer to the royalty storage struct.

Uses inline assembly to access the storage slot defined by STORAGE_POSITION.


```solidity
function getStorage() internal pure returns (RoyaltyStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`RoyaltyStorage`|The RoyaltyStorage struct in storage.|


### royaltyInfo

Returns royalty information for a given token and sale price.

Returns token-specific royalty if set, otherwise falls back to default royalty.
Royalty amount is calculated as a percentage of the sale price using basis points.
Implements the ERC-2981 royaltyInfo function.


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

