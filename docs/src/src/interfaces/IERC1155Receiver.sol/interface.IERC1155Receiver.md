# IERC1155Receiver
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/interfaces/IERC1155Receiver.sol)

Interface that must be implemented by smart contracts in order to receive ERC-1155 token transfers.


## Functions
### onERC1155Received

Handles the receipt of a single ERC-1155 token type.

This function is called at the end of a `safeTransferFrom` after the balance has been updated.
IMPORTANT: To accept the transfer, this must return
`bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))`
(i.e. 0xf23a6e61, or its own function selector).


```solidity
function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data)
    external
    returns (bytes4);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address which initiated the transfer (i.e. msg.sender).|
|`_from`|`address`|The address which previously owned the token.|
|`_id`|`uint256`|The ID of the token being transferred.|
|`_value`|`uint256`|The amount of tokens being transferred.|
|`_data`|`bytes`|Additional data with no specified format.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes4`|`bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` if transfer is allowed.|


### onERC1155BatchReceived

Handles the receipt of multiple ERC-1155 token types.

This function is called at the end of a `safeBatchTransferFrom` after the balances have been updated.
IMPORTANT: To accept the transfer(s), this must return
`bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
(i.e. 0xbc197c81, or its own function selector).


```solidity
function onERC1155BatchReceived(
    address _operator,
    address _from,
    uint256[] calldata _ids,
    uint256[] calldata _values,
    bytes calldata _data
) external returns (bytes4);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_operator`|`address`|The address which initiated the batch transfer (i.e. msg.sender).|
|`_from`|`address`|The address which previously owned the token.|
|`_ids`|`uint256[]`|An array containing ids of each token being transferred (order and length must match _values array).|
|`_values`|`uint256[]`|An array containing amounts of each token being transferred (order and length must match _ids array).|
|`_data`|`bytes`|Additional data with no specified format.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes4`|`bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` if transfer is allowed.|


