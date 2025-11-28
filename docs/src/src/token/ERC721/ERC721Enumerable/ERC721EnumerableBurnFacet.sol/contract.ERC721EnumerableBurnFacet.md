# ERC721EnumerableBurnFacet
[Git Source](https://github.com/maxnorm/Compose/blob/c5fa0f9e7d2d9c835414fc63aa46e9da0ac324f9/src/token/ERC721/ERC721Enumerable/ERC721EnumerableBurnFacet.sol)

**Title:**
ERC-721 Enumerable Burn Facet

Provides an external burn entry point that composes with other ERC-721 enumerable facets.

Keeps burn logic isolated so diamonds can opt-in without inheriting unrelated functionality.
The corresponding library file for the facet that has the burn() internal function is in the LibERC721Enumerable.sol file.


## State Variables
### STORAGE_POSITION

```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc721.enumerable")
```


## Functions
### getStorage

Returns the storage struct used by this facet.


```solidity
function getStorage() internal pure returns (ERC721EnumerableStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC721EnumerableStorage`|The ERC721Enumerable storage struct.|


### burn

Burns (destroys) a token, removing it from enumeration tracking.


```solidity
function burn(uint256 _tokenId) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The ID of the token to burn.|


## Events
### Transfer
Emitted when ownership of a token changes, including burning.


```solidity
event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address transferring the token (or owner when burning).|
|`_to`|`address`|The address receiving the token (zero address when burning).|
|`_tokenId`|`uint256`|The ID of the token being transferred.|

## Errors
### ERC721NonexistentToken
Thrown when attempting to interact with a non-existent token.


```solidity
error ERC721NonexistentToken(uint256 _tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The ID of the token that does not exist.|

### ERC721InsufficientApproval
Thrown when the caller lacks approval to operate on the token.


```solidity
error ERC721InsufficientApproval(address _operator, uint256 _tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address attempting the unauthorized operation.|
|`_tokenId`|`uint256`|The token ID involved in the failed operation.|

## Structs
### ERC721EnumerableStorage
**Note:**
storage-location: erc8042:compose.erc721.enumerable


```solidity
struct ERC721EnumerableStorage {
    mapping(uint256 tokenId => address owner) ownerOf;
    mapping(address owner => uint256[] ownerTokens) ownerTokens;
    mapping(uint256 tokenId => uint256 ownerTokensIndex) ownerTokensIndex;
    uint256[] allTokens;
    mapping(uint256 tokenId => uint256 allTokensIndex) allTokensIndex;
    mapping(address owner => mapping(address operator => bool approved)) isApprovedForAll;
    mapping(uint256 tokenId => address approved) approved;
}
```

