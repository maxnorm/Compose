# AccessControlStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlPausable/LibAccessControlPausable.sol)


```solidity
struct AccessControlStorage {
mapping(address account => mapping(bytes32 role => bool hasRole)) hasRole;
mapping(bytes32 role => bytes32 adminRole) adminRole;
}
```

