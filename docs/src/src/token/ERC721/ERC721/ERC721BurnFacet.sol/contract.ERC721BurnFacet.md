# ERC721BurnFacet
[Git Source](https://github.com/maxnorm/Compose/blob/6956906c9ed86d52ca90b8f2deea310beff37f02/src/token/ERC721/ERC721/ERC721BurnFacet.sol)

**Title:**
ERC-721 Token

A complete, dependency-free ERC-721 implementation using the diamond storage pattern.

This facet provides metadata, ownership, approvals, safe transfers, minting, burning, and helpers.


## State Variables
### STORAGE_POSITION

```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc721")
```


## Functions
### getStorage

Returns a pointer to the ERC-721 storage struct.

Uses inline assembly to access the storage slot defined by STORAGE_POSITION.


```solidity
function getStorage() internal pure returns (ERC721Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC721Storage`|The ERC721Storage struct in storage.|


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
Emitted when ownership of an NFT changes by any mechanism.


```solidity
event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
```

### Approval
Emitted when the approved address for an NFT is changed or reaffirmed.


```solidity
event Approval(address indexed _owner, address indexed _to, uint256 indexed _tokenId);
```

### ApprovalForAll
Emitted when an operator is enabled or disabled for an owner.


```solidity
event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
```

## Errors
### ERC721NonexistentToken
Error indicating that the queried token does not exist.


```solidity
error ERC721NonexistentToken(uint256 _tokenId);
```

### ERC721InsufficientApproval
Error indicating the operator lacks approval to transfer the given token.


```solidity
error ERC721InsufficientApproval(address _operator, uint256 _tokenId);
```

## Structs
### ERC721Storage
**Note:**
storage-location: erc8042:compose.erc721


```solidity
struct ERC721Storage {
    mapping(uint256 tokenId => address owner) ownerOf;
    mapping(address owner => uint256 balance) balanceOf;
    mapping(address owner => mapping(address operator => bool approved)) isApprovedForAll;
    mapping(uint256 tokenId => address approved) approved;
}
```

