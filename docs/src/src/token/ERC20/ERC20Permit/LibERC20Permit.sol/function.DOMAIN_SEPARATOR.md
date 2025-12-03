# DOMAIN_SEPARATOR
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Permit/LibERC20Permit.sol)

Returns the domain separator used in the encoding of the signature for {permit}.

This value is unique to a contract and chain ID combination to prevent replay attacks.


```solidity
function DOMAIN_SEPARATOR() view returns (bytes32);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes32`|The domain separator.|


