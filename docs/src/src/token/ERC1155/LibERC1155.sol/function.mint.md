# mint
[Git Source](https://github.com/maxnorm/Compose/blob/f412c7c7d10aaefbcfad4abc92cd2d16bf0bacad/src/token/ERC1155/LibERC1155.sol)

Mints a single token type to an address.

Increases the balance and emits a TransferSingle event.
Performs receiver validation if recipient is a contract.


```solidity
function mint(address _to, uint256 _id, uint256 _value, bytes memory _data) ;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_to`|`address`|The address that will receive the tokens.|
|`_id`|`uint256`|The token type to mint.|
|`_value`|`uint256`|The amount of tokens to mint.|
|`_data`|`bytes`||


