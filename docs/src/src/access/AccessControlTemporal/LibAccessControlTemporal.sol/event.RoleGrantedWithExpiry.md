# RoleGrantedWithExpiry
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/access/AccessControlTemporal/LibAccessControlTemporal.sol)

Event emitted when a role is granted with an expiry timestamp.


```solidity
event RoleGrantedWithExpiry(
bytes32 indexed _role, address indexed _account, uint256 _expiresAt, address indexed _sender
);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|The role that was granted.|
|`_account`|`address`|The account that was granted the role.|
|`_expiresAt`|`uint256`|The timestamp when the role expires.|
|`_sender`|`address`|The account that granted the role.|

