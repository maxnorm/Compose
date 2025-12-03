# ERC1155InsufficientBalance
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Provides internal functions and storage layout for ERC-1155 multi-token logic.

Thrown when insufficient balance for a transfer or burn operation.

Uses ERC-8042 for storage location standardization and ERC-6093 for error conventions.
This library is intended to be used by custom facets to integrate with ERC-1155 functionality.


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

