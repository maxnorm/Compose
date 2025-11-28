# LibERC721
[Git Source](https://github.com/maxnorm/Compose/blob/6956906c9ed86d52ca90b8f2deea310beff37f02/src/token/ERC721/ERC721/LibERC721.sol)

**Title:**
ERC-721 Library for Compose

Provides internal logic for ERC-721 token management using diamond storage.
This library is intended to be used by custom facets to integrate with ERC-721 functionality.

Implements minting, burning, and transferring of ERC-721 tokens without dependencies.
Uses ERC-8042-compliant storage definition and includes ERC-6093 standard custom errors.


## State Variables
### STORAGE_POSITION
Storage position constant defined via keccak256 hash of diamond storage identifier.


```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc721")
```


## Functions
### getStorage

Returns the ERC-721 storage struct from its predefined slot.

Uses inline assembly to access diamond storage location.


```solidity
function getStorage() internal pure returns (ERC721Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC721Storage`|The storage reference for ERC-721 state variables.|


### transferFrom

Transfers ownership of a token ID from one address to another.

Validates ownership, approval, and receiver address before updating state.


```solidity
function transferFrom(address _from, address _to, uint256 _tokenId) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The current owner of the token.|
|`_to`|`address`|The address that will receive the token.|
|`_tokenId`|`uint256`|The ID of the token being transferred.|


### mint

Mints a new ERC-721 token to the specified address.

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

Burns (destroys) a specific ERC-721 token.

Reverts if the token does not exist. Clears ownership and approval.


```solidity
function burn(uint256 _tokenId) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The ID of the token to burn.|


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
Thrown when the sender address is invalid (e.g., zero address).


```solidity
error ERC721InvalidSender(address _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|The invalid sender address.|

### ERC721InvalidReceiver
Thrown when the receiver address is invalid (e.g., zero address).


```solidity
error ERC721InvalidReceiver(address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|The invalid receiver address.|

### ERC721InsufficientApproval
Thrown when an operator lacks sufficient approval to manage a token.


```solidity
error ERC721InsufficientApproval(address _operator, uint256 _tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address attempting the unauthorized operation.|
|`_tokenId`|`uint256`|The ID of the token involved.|

## Structs
### ERC721Storage
Storage layout for ERC-721 token management.

Defines ownership, balances, approvals, and operator mappings per ERC-721 standard.

**Note:**
storage-location: erc8042:compose.erc721


```solidity
struct ERC721Storage {
    mapping(uint256 tokenId => address owner) ownerOf;
    mapping(address owner => uint256 balance) balanceOf;
    mapping(address owner => mapping(address operator => bool approved)) isApprovedForAll;
    mapping(uint256 tokenId => address approved) approved;
    string name;
    string symbol;
    string baseURI;
}
```

