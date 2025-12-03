# AccessControlTemporalStorage
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlTemporal/LibAccessControlTemporal.sol)


```solidity
struct AccessControlTemporalStorage {
mapping(address account => mapping(bytes32 role => uint256 expiryTimestamp)) roleExpiry;
}
```

