# Constants
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

### STORAGE_POSITION

```solidity
bytes32 constant STORAGE_POSITION = keccak256("compose.erc2981")
```

### FEE_DENOMINATOR
The denominator with which to interpret royalty fees as a percentage of sale price.
Expressed in basis points where 10000 = 100%. This value aligns with the ERC-2981
specification and marketplace expectations. Implemented as a constant for gas efficiency
rather than the virtual function pattern, as Compose does not support inheritance-based
customization. To modify this value, deploy a custom facet implementation.


```solidity
uint96 constant FEE_DENOMINATOR = 10000
```

