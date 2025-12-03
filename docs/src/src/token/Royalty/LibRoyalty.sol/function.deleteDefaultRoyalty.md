# deleteDefaultRoyalty
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

Removes default royalty information.

After calling this function, royaltyInfo will return (address(0), 0) for tokens without specific royalty.


```solidity
function deleteDefaultRoyalty() ;
```

