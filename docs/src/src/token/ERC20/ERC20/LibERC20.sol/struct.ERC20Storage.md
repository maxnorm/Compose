# ERC20Storage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20/LibERC20.sol)


```solidity
struct ERC20Storage {
mapping(address owner => uint256 balance) balanceOf;
uint256 totalSupply;
mapping(address owner => mapping(address spender => uint256 allowance)) allowance;
uint8 decimals;
string name;
string symbol;
}
```

