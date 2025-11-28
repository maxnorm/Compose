# LibERC721Enumerable
[Git Source](https://github.com/maxnorm/Compose/blob/4c4748fcb0d24a68579be4c02891d5ceb2800314/src/token/ERC721/ERC721Enumerable/LibERC721Enumerable.sol)

**Title:**
ERC-721 Enumerable Library for Compose

Provides internal logic for enumerable ERC-721 tokens using diamond storage.
This library is intended to be used by custom facets to integrate with ERC-721 functionality.

Implements ERC-721 operations with token enumeration support (tracking owned and global tokens).
Follows ERC-8042 for storage layout and ERC-6093 for standardized custom errors.


## State Variables
### STORAGE_POSITION
Storage slot defined via keccak256 hash of the diamond storage identifier.


```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc721.enumerable")
```


## Functions
### getStorage

Returns the ERC-721 enumerable storage struct from its predefined slot.

Uses inline assembly to point to the correct diamond storage position.


```solidity
function getStorage() internal pure returns (ERC721EnumerableStorage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC721EnumerableStorage`|The storage reference for ERC-721 enumerable state variables.|


### transferFrom

Transfers a token ID from one address to another, updating enumeration data.

Validates ownership, approval, and receiver address before state updates.


```solidity
function transferFrom(address _from, address _to, uint256 _tokenId, address _sender) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The current owner of the token.|
|`_to`|`address`|The address receiving the token.|
|`_tokenId`|`uint256`|The ID of the token being transferred.|
|`_sender`|`address`|The initiator of the transfer (may be owner or approved operator).|


### mint

Mints a new ERC-721 token to the specified address, adding it to enumeration lists.

Reverts if the receiver address is zero or if the token already exists.


```solidity
function mint(address _to, uint256 _tokenId) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The address that will own the newly minted token.|
|`_tokenId`|`uint256`|The ID of the token to mint.|


### burn

Burns (destroys) an existing ERC-721 token, removing it from enumeration lists.

Reverts if the token does not exist or if the sender is not authorized.


```solidity
function burn(uint256 _tokenId, address _sender) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The ID of the token to burn.|
|`_sender`|`address`|The address initiating the burn.|


## Events
### Transfer
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

### ERC721IncorrectOwner
Thrown when the sender is not the owner of the token.


```solidity
error ERC721IncorrectOwner(address _sender, uint256 _tokenId, address _owner);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|The address attempting the operation.|
|`_tokenId`|`uint256`|The ID of the token being transferred.|
|`_owner`|`address`|The actual owner of the token.|

### ERC721InvalidSender
Thrown when the sender address is invalid.


```solidity
error ERC721InvalidSender(address _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|The invalid sender address.|

### ERC721InvalidReceiver
Thrown when the receiver address is invalid.


```solidity
error ERC721InvalidReceiver(address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The invalid receiver address.|

### ERC721InsufficientApproval
Thrown when an operator lacks approval to manage a token.


```solidity
error ERC721InsufficientApproval(address _operator, uint256 _tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address attempting the unauthorized operation.|
|`_tokenId`|`uint256`|The ID of the token involved.|

## Structs
### ERC721EnumerableStorage
Storage layout for ERC-721 enumerable tokens.

Includes mappings for ownership, approvals, operator permissions, and enumeration tracking.

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
    string name;
    string symbol;
    string baseURI;
}
```

