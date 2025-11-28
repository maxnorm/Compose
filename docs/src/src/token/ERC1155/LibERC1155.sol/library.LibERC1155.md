# LibERC1155
[Git Source](https://github.com/maxnorm/Compose/blob/c5fa0f9e7d2d9c835414fc63aa46e9da0ac324f9/src/token/ERC1155/LibERC1155.sol)

**Title:**
LibERC1155 — ERC-1155 Library

Provides internal functions and storage layout for ERC-1155 multi-token logic.

Uses ERC-8042 for storage location standardization and ERC-6093 for error conventions.
This library is intended to be used by custom facets to integrate with ERC-1155 functionality.


## State Variables
### STORAGE_POSITION
Storage position determined by the keccak256 hash of the diamond storage identifier.


```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc1155")
```


## Functions
### getStorage

Returns the ERC-1155 storage struct from the predefined diamond storage slot.

Uses inline assembly to set the storage slot reference.


```solidity
function getStorage() internal pure returns (ERC1155Storage storage s);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`s`|`ERC1155Storage`|The ERC-1155 storage struct reference.|


### mint

Mints a single token type to an address.

Increases the balance and emits a TransferSingle event.
Performs receiver validation if recipient is a contract.


```solidity
function mint(address _to, uint256 _id, uint256 _value, bytes memory _data) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The address that will receive the tokens.|
|`_id`|`uint256`|The token type to mint.|
|`_value`|`uint256`|The amount of tokens to mint.|
|`_data`|`bytes`||


### mintBatch

Mints multiple token types to an address in a single transaction.

Increases balances for each token type and emits a TransferBatch event.
Performs receiver validation if recipient is a contract.


```solidity
function mintBatch(address _to, uint256[] memory _ids, uint256[] memory _values, bytes memory _data) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The address that will receive the tokens.|
|`_ids`|`uint256[]`|The token types to mint.|
|`_values`|`uint256[]`|The amounts of tokens to mint for each type.|
|`_data`|`bytes`||


### burn

Burns a single token type from an address.

Decreases the balance and emits a TransferSingle event.
Reverts if the account has insufficient balance.


```solidity
function burn(address _from, uint256 _id, uint256 _value) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address whose tokens will be burned.|
|`_id`|`uint256`|The token type to burn.|
|`_value`|`uint256`|The amount of tokens to burn.|


### burnBatch

Burns multiple token types from an address in a single transaction.

Decreases balances for each token type and emits a TransferBatch event.
Reverts if the account has insufficient balance for any token type.


```solidity
function burnBatch(address _from, uint256[] memory _ids, uint256[] memory _values) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address whose tokens will be burned.|
|`_ids`|`uint256[]`|The token types to burn.|
|`_values`|`uint256[]`|The amounts of tokens to burn for each type.|


### safeTransferFrom

Safely transfers a single token type from one address to another.

Validates ownership, approval, and receiver address before updating balances.
Performs ERC1155Receiver validation if recipient is a contract (safe transfer).
Complies with EIP-1155 safe transfer requirements.


```solidity
function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, address _operator) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address to transfer from.|
|`_to`|`address`|The address to transfer to.|
|`_id`|`uint256`|The token type to transfer.|
|`_value`|`uint256`|The amount of tokens to transfer.|
|`_operator`|`address`|The address initiating the transfer (may be owner or approved operator).|


### safeBatchTransferFrom

Safely transfers multiple token types from one address to another in a single transaction.

Validates ownership, approval, and receiver address before updating balances for each token type.
Performs ERC1155Receiver validation if recipient is a contract (safe transfer).
Complies with EIP-1155 safe transfer requirements.


```solidity
function safeBatchTransferFrom(
    address _from,
    address _to,
    uint256[] memory _ids,
    uint256[] memory _values,
    address _operator
) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address to transfer from.|
|`_to`|`address`|The address to transfer to.|
|`_ids`|`uint256[]`|The token types to transfer.|
|`_values`|`uint256[]`|The amounts of tokens to transfer for each type.|
|`_operator`|`address`|The address initiating the transfer (may be owner or approved operator).|


### setTokenURI

Sets the token-specific URI for a given token ID.

Sets tokenURIs[_tokenId] to the provided string and emits a URI event with the full computed URI.
The emitted URI is the concatenation of baseURI and the token-specific URI.


```solidity
function setTokenURI(uint256 _tokenId, string memory _tokenURI) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_tokenId`|`uint256`|The token ID to set the URI for.|
|`_tokenURI`|`string`|The token-specific URI string to be concatenated with baseURI.|


### setBaseURI

Sets the base URI prefix for token-specific URIs.

The base URI is concatenated with token-specific URIs set via setTokenURI.
Does not affect the default URI used when no token-specific URI is set.


```solidity
function setBaseURI(string memory _baseURI) internal;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_baseURI`|`string`|The base URI string to prepend to token-specific URIs.|


## Events
### TransferSingle
Emitted when a single token type is transferred.


```solidity
event TransferSingle(
    address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value
);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address which initiated the transfer.|
|`_from`|`address`|The address which previously owned the token.|
|`_to`|`address`|The address which now owns the token.|
|`_id`|`uint256`|The token type being transferred.|
|`_value`|`uint256`|The amount of tokens transferred.|

### TransferBatch
Emitted when multiple token types are transferred.


```solidity
event TransferBatch(
    address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values
);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address which initiated the batch transfer.|
|`_from`|`address`|The address which previously owned the tokens.|
|`_to`|`address`|The address which now owns the tokens.|
|`_ids`|`uint256[]`|The token types being transferred.|
|`_values`|`uint256[]`|The amounts of tokens transferred.|

### URI
Emitted when the URI for token type `_id` changes to `_value`.


```solidity
event URI(string _value, uint256 indexed _id);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_value`|`string`|The new URI for the token type.|
|`_id`|`uint256`|The token type whose URI changed.|

## Errors
### ERC1155InsufficientBalance
Thrown when insufficient balance for a transfer or burn operation.


```solidity
error ERC1155InsufficientBalance(address _sender, uint256 _balance, uint256 _needed, uint256 _tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|Address attempting the operation.|
|`_balance`|`uint256`|Current balance of the sender.|
|`_needed`|`uint256`|Amount required to complete the operation.|
|`_tokenId`|`uint256`|The token ID involved.|

### ERC1155InvalidSender
Thrown when the sender address is invalid.


```solidity
error ERC1155InvalidSender(address _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|Invalid sender address.|

### ERC1155InvalidReceiver
Thrown when the receiver address is invalid.


```solidity
error ERC1155InvalidReceiver(address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|Invalid receiver address.|

### ERC1155InvalidArrayLength
Thrown when array lengths don't match in batch operations.


```solidity
error ERC1155InvalidArrayLength(uint256 _idsLength, uint256 _valuesLength);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_idsLength`|`uint256`|Length of the ids array.|
|`_valuesLength`|`uint256`|Length of the values array.|

### ERC1155MissingApprovalForAll
Thrown when missing approval for an operator.


```solidity
error ERC1155MissingApprovalForAll(address _operator, address _owner);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|Address attempting the operation.|
|`_owner`|`address`|The token owner.|

## Structs
### ERC1155Storage
ERC-8042 compliant storage struct for ERC-1155 token data.

**Note:**
storage-location: erc8042:compose.erc1155


```solidity
struct ERC1155Storage {
    mapping(uint256 id => mapping(address account => uint256 balance)) balanceOf;
    mapping(address account => mapping(address operator => bool)) isApprovedForAll;
    string uri;
    string baseURI;
    mapping(uint256 tokenId => string) tokenURIs;
}
```

