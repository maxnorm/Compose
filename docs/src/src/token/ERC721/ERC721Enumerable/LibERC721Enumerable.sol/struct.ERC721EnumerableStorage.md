# ERC721EnumerableStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC721/ERC721Enumerable/LibERC721Enumerable.sol)


```solidity
struct ERC721EnumerableStorage {
mapping(uint256 tokenId => address owner) ownerOf;
mapping(address owner => uint256[] ownerTokens) ownerTokens;
mapping(uint256 tokenId => uint256 ownerTokensIndex) ownerTokensIndex;
uint256[] allTokens;
mapping(uint256 tokenId => uint256 allTokensIndex) allTokensIndex;
mapping(address owner => mapping(address operator => bool approved)) isApprovedForAll;
mapping(uint256 tokenId => address approved) approved;
string name;
string symbol;
string baseURI;
}
```

