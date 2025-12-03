# checkTokenBridge
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Bridgeable/LibERC20Bridgeable.sol)

Internal check to check if the bridge (caller) is trusted.

Reverts if caller is zero or not in the AccessControl `trusted-bridge` role.


```solidity
function checkTokenBridge(address _caller) view;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_caller`|`address`|The address to validate|


