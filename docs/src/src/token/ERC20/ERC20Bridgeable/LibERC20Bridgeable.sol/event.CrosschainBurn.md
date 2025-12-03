# CrosschainBurn
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Bridgeable/LibERC20Bridgeable.sol)

Emitted when a crosschain transfer burns tokens.


```solidity
event CrosschainBurn(address indexed _from, uint256 _amount, address indexed _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|    Address of the account tokens are being burned from.|
|`_amount`|`uint256`|  Amount of tokens burned.|
|`_sender`|`address`|  Address of the caller (msg.sender) who invoked crosschainBurn.|

