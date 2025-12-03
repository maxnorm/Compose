# IERC721Enumerable
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/interfaces/IERC721Enumerable.sol)

Interface for ERC-721 token contracts with enumeration support and custom errors

This interface includes all custom errors used by ERC-721 Enumerable implementations


## Functions
### name

Returns the name of the token collection.


```solidity
function name() external view returns (string memory);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`string`|The token collection name.|


### symbol

Returns the symbol of the token collection.


```solidity
function symbol() external view returns (string memory);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`string`|The token symbol.|


### totalSupply

Returns the total number of tokens in existence.


```solidity
function totalSupply() external view returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The total supply of tokens.|


### balanceOf

Returns the number of tokens owned by an address.


```solidity
function balanceOf(address _owner) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address to query.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The balance (number of tokens owned).|


### ownerOf

Returns the owner of a given token ID.


```solidity
function ownerOf(uint256 _tokenId) external view returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The token ID to query.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|The address of the token owner.|


### tokenOfOwnerByIndex

Returns a token ID owned by a given address at a specific index.


```solidity
function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The address to query.|
|`_index`|`uint256`|The index of the token.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The token ID owned by `_owner` at `_index`.|


### getApproved

Returns the approved address for a given token ID.


```solidity
function getApproved(uint256 _tokenId) external view returns (address);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The token ID to query.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|The approved address for the token.|


### isApprovedForAll

Returns whether an operator is approved for all tokens of an owner.


```solidity
function isApprovedForAll(address _owner, address _operator) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|The token owner.|
|`_operator`|`address`|The operator address.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if approved for all, false otherwise.|


### approve

Approves another address to transfer a specific token ID.


```solidity
function approve(address _approved, uint256 _tokenId) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_approved`|`address`|The address being approved.|
|`_tokenId`|`uint256`|The token ID to approve.|


### setApprovalForAll

Approves or revokes an operator to manage all tokens of the caller.


```solidity
function setApprovalForAll(address _operator, bool _approved) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The operator address.|
|`_approved`|`bool`|True to approve, false to revoke.|


### transferFrom

Transfers a token from one address to another.


```solidity
function transferFrom(address _from, address _to, uint256 _tokenId) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The current owner of the token.|
|`_to`|`address`|The recipient address.|
|`_tokenId`|`uint256`|The token ID to transfer.|


### safeTransferFrom

Safely transfers a token, checking for receiver contract compatibility.


```solidity
function safeTransferFrom(address _from, address _to, uint256 _tokenId) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The current owner of the token.|
|`_to`|`address`|The recipient address.|
|`_tokenId`|`uint256`|The token ID to transfer.|


### safeTransferFrom

Safely transfers a token with additional data.


```solidity
function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata _data) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The current owner of the token.|
|`_to`|`address`|The recipient address.|
|`_tokenId`|`uint256`|The token ID to transfer.|
|`_data`|`bytes`|Additional data to send to the receiver.|


## Events
### Transfer
Emitted when a token is transferred between addresses.


```solidity
event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
```

### Approval
Emitted when a token is approved for transfer by another address.


```solidity
event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
```

### ApprovalForAll
Emitted when an operator is approved or revoked for all tokens of an owner.


```solidity
event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);
```

## Errors
### ERC721InvalidOwner
Thrown when querying or transferring from an invalid owner address.


```solidity
error ERC721InvalidOwner(address _owner);
```

### ERC721NonexistentToken
Thrown when operating on a non-existent token.


```solidity
error ERC721NonexistentToken(uint256 _tokenId);
```

### ERC721IncorrectOwner
Thrown when the provided owner does not match the actual owner of the token.


```solidity
error ERC721IncorrectOwner(address _sender, uint256 _tokenId, address _owner);
```

### ERC721InvalidSender
Thrown when the sender address is invalid.


```solidity
error ERC721InvalidSender(address _sender);
```

### ERC721InvalidReceiver
Thrown when the receiver address is invalid.


```solidity
error ERC721InvalidReceiver(address _receiver);
```

### ERC721InsufficientApproval
Thrown when the operator lacks sufficient approval for a transfer.


```solidity
error ERC721InsufficientApproval(address _operator, uint256 _tokenId);
```

### ERC721InvalidApprover
Thrown when an invalid approver is provided.


```solidity
error ERC721InvalidApprover(address _approver);
```

### ERC721InvalidOperator
Thrown when an invalid operator is provided.


```solidity
error ERC721InvalidOperator(address _operator);
```

### ERC721OutOfBoundsIndex
Thrown when an index is out of bounds during enumeration.


```solidity
error ERC721OutOfBoundsIndex(address _owner, uint256 _index);
```

