# ERC6909Storage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC6909/ERC6909/LibERC6909.sol)

**Note:**
storage-location: erc8042:compose.erc6909


```solidity
struct ERC6909Storage {
mapping(address owner => mapping(uint256 id => uint256 amount)) balanceOf;
mapping(address owner => mapping(address spender => mapping(uint256 id => uint256 amount))) allowance;
mapping(address owner => mapping(address spender => bool)) isOperator;
}
```

