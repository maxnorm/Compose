# IERC1155
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/interfaces/IERC1155.sol)

Interface for ERC-1155 token contracts with custom errors

This interface includes all custom errors used by ERC-1155 implementations (ERC-6093)


## Functions
### balanceOf

Returns the amount of tokens of token type `id` owned by `account`.


```solidity
function balanceOf(address _account, uint256 _id) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_account`|`address`|The address to query the balance of.|
|`_id`|`uint256`|The token type to query.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The balance of the token type.|


### balanceOfBatch

Batched version of [balanceOf](//home/mn/os-contribution/Compose/docs/src/src/interfaces/IERC1155.sol/interface.IERC1155.md#balanceof).


```solidity
function balanceOfBatch(address[] calldata _accounts, uint256[] calldata _ids)
    external
    view
    returns (uint256[] memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_accounts`|`address[]`|The addresses to query the balances of (order and length must match _ids array).|
|`_ids`|`uint256[]`|The token types to query (order and length must match _accounts array).|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256[]`|The balances of the token types.|


### setApprovalForAll

Grants or revokes permission to `operator` to transfer the caller's tokens.


```solidity
function setApprovalForAll(address _operator, bool _approved) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address to grant/revoke approval to.|
|`_approved`|`bool`|True to approve, false to revoke.|


### isApprovedForAll

Returns true if `operator` is approved to transfer `account`'s tokens.


```solidity
function isApprovedForAll(address _account, address _operator) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_account`|`address`|The token owner.|
|`_operator`|`address`|The operator to query.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the operator is approved, false otherwise.|


### safeTransferFrom

Transfers `value` amount of token type `id` from `from` to `to`.


```solidity
function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address to transfer from.|
|`_to`|`address`|The address to transfer to.|
|`_id`|`uint256`|The token type to transfer.|
|`_value`|`uint256`|The amount to transfer.|
|`_data`|`bytes`|Additional data with no specified format.|


### safeBatchTransferFrom

Batched version of [safeTransferFrom](//home/mn/os-contribution/Compose/docs/src/src/interfaces/IERC1155.sol/interface.IERC1155.md#safetransferfrom).


```solidity
function safeBatchTransferFrom(
    address _from,
    address _to,
    uint256[] calldata _ids,
    uint256[] calldata _values,
    bytes calldata _data
) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The address to transfer from.|
|`_to`|`address`|The address to transfer to.|
|`_ids`|`uint256[]`|The token types to transfer (order and length must match _values array).|
|`_values`|`uint256[]`|The amounts to transfer (order and length must match _ids array).|
|`_data`|`bytes`|Additional data with no specified format.|


### uri

Returns the URI for token type `id`.


```solidity
function uri(uint256 _id) external view returns (string memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_id`|`uint256`|The token type to query.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`string`|The URI for the token type.|


## Events
### TransferSingle
Emitted when `value` amount of tokens of type `id` are transferred from `from` to `to` by `operator`.


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
Equivalent to multiple [TransferSingle](//home/mn/os-contribution/Compose/docs/src/src/interfaces/IERC1155.sol/interface.IERC1155.md#transfersingle) events, where `operator`, `from` and `to` are the same for all transfers.


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

### ApprovalForAll
Emitted when `account` grants or revokes permission to `operator` to transfer their tokens.


```solidity
event ApprovalForAll(address indexed _account, address indexed _operator, bool _approved);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_account`|`address`|The token owner granting/revoking approval.|
|`_operator`|`address`|The address being approved/revoked.|
|`_approved`|`bool`|True if approval is granted, false if revoked.|

### URI
Emitted when the URI for token type `id` changes to `value`.


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
Error indicating insufficient balance for a transfer.


```solidity
error ERC1155InsufficientBalance(address _sender, uint256 _balance, uint256 _needed, uint256 _tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|Address attempting the transfer.|
|`_balance`|`uint256`|Current balance of the sender.|
|`_needed`|`uint256`|Amount required to complete the operation.|
|`_tokenId`|`uint256`|The token ID involved.|

### ERC1155InvalidSender
Error indicating the sender address is invalid.


```solidity
error ERC1155InvalidSender(address _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|Invalid sender address.|

### ERC1155InvalidReceiver
Error indicating the receiver address is invalid.


```solidity
error ERC1155InvalidReceiver(address _receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_receiver`|`address`|Invalid receiver address.|

### ERC1155MissingApprovalForAll
Error indicating missing approval for an operator.


```solidity
error ERC1155MissingApprovalForAll(address _operator, address _owner);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|Address attempting the operation.|
|`_owner`|`address`|The token owner.|

### ERC1155InvalidApprover
Error indicating the approver address is invalid.


```solidity
error ERC1155InvalidApprover(address _approver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_approver`|`address`|Invalid approver address.|

### ERC1155InvalidOperator
Error indicating the operator address is invalid.


```solidity
error ERC1155InvalidOperator(address _operator);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|Invalid operator address.|

### ERC1155InvalidArrayLength
Error indicating array length mismatch in batch operations.


```solidity
error ERC1155InvalidArrayLength(uint256 _idsLength, uint256 _valuesLength);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_idsLength`|`uint256`|Length of the ids array.|
|`_valuesLength`|`uint256`|Length of the values array.|

