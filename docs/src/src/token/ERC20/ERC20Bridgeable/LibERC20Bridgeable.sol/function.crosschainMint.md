# crosschainMint
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Bridgeable/LibERC20Bridgeable.sol)

Cross-chain mint — callable only by an address having the `trusted-bridge` role.


```solidity
function crosschainMint(address _account, uint256 _value) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_account`|`address`|The account to mint tokens to.|
|`_value`|`uint256`|The amount to mint.|


