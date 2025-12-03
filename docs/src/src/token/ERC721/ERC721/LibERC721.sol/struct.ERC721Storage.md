# ERC721Storage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721/LibERC721.sol)


```solidity
struct ERC721Storage {
mapping(uint256 tokenId => address owner) ownerOf;
mapping(address owner => uint256 balance) balanceOf;
mapping(address owner => mapping(address operator => bool approved)) isApprovedForAll;
mapping(uint256 tokenId => address approved) approved;
string name;
string symbol;
string baseURI;
}
```

