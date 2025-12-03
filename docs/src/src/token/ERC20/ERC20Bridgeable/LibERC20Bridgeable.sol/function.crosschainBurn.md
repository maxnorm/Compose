# crosschainBurn
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Bridgeable/LibERC20Bridgeable.sol)

Cross-chain burn — callable only by an address having the `trusted-bridge` role.


```solidity
function crosschainBurn(address _from, uint256 _value) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_from`|`address`|The account to burn tokens from.|
|`_value`|`uint256`|The amount to burn.|


