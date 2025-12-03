# CrosschainMint
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Bridgeable/LibERC20Bridgeable.sol)

Emitted when tokens are minted via a cross-chain bridge.


```solidity
event CrosschainMint(address indexed _to, uint256 _amount, address indexed _sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The recipient of minted tokens.|
|`_amount`|`uint256`|The amount minted.|
|`_sender`|`address`|The bridge account that triggered the mint (msg.sender).|

