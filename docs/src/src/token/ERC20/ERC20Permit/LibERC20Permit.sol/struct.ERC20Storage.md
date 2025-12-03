# ERC20Storage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Permit/LibERC20Permit.sol)

**Note:**
storage-location: erc8042:compose.erc20


```solidity
struct ERC20Storage {
mapping(address owner => uint256 balance) balanceOf;
uint256 totalSupply;
mapping(address owner => mapping(address spender => uint256 allowance)) allowance;
uint8 decimals;
string name;
}
```

