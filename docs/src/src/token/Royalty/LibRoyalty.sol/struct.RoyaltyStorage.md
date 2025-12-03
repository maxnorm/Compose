# RoyaltyStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/Royalty/LibRoyalty.sol)

**Note:**
storage-location: erc8042:compose.erc2981


```solidity
struct RoyaltyStorage {
RoyaltyInfo defaultRoyaltyInfo;
mapping(uint256 tokenId => RoyaltyInfo) tokenRoyaltyInfo;
}
```

