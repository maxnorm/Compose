# ERC165Storage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/interfaceDetection/ERC165/LibERC165.sol)


```solidity
struct ERC165Storage {
/*
 * @notice Mapping of interface IDs to whether they are supported
 */
mapping(bytes4 => bool) supportedInterfaces;
}
```

