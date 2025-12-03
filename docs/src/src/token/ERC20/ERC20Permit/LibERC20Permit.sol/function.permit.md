# permit
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC20/ERC20Permit/LibERC20Permit.sol)

Validates a permit signature and sets allowance.

Emits Approval event; must be emitted by the calling facet/contract.


```solidity
function permit(address _owner, address _spender, uint256 _value, uint256 _deadline, uint8 _v, bytes32 _r, bytes32 _s) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|  Token owner.|
|`_spender`|`address`|Token spender.|
|`_value`|`uint256`|  Allowance value.|
|`_deadline`|`uint256`|Permit's time deadline.|
|`_v`|`uint8`||
|`_r`|`bytes32`||
|`_s`|`bytes32`||


