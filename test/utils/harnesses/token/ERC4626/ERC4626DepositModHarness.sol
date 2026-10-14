// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

import "src/token/ERC20/Vault/Asset/ERC4626AssetMod.sol" as ERC4626AssetMod;
import "src/token/ERC20/Vault/Deposit/ERC4626DepositMod.sol" as ERC4626DepositMod;
import "src/token/ERC20/Mint/ERC20MintMod.sol" as ERC20MintMod;

contract ERC4626DepositModHarness {
    constructor(address _asset) {
        ERC4626AssetMod.setAsset(_asset);
        ERC20MintMod.mint(address(this), 1_000 ether);
    }

    function deposit(uint256 _assets, address _receiver, uint256 _totalAssets) external returns (uint256) {
        return ERC4626DepositMod.deposit(_assets, _receiver, _totalAssets, address(this));
    }
}
