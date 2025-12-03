# ERC721InvalidSender
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721/LibERC721.sol)

Thrown when the sender address is invalid (e.g., zero address).


```solidity
error ERC721InvalidSender(address _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_sender`|`address`|The invalid sender address.|

