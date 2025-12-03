# ERC1155Storage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

ERC-8042 compliant storage struct for ERC-1155 token data.

**Note:**
storage-location: erc8042:compose.erc1155


```solidity
struct ERC1155Storage {
mapping(uint256 id => mapping(address account => uint256 balance)) balanceOf;
mapping(address account => mapping(address operator => bool)) isApprovedForAll;
string uri;
string baseURI;
mapping(uint256 tokenId => string) tokenURIs;
}
```

