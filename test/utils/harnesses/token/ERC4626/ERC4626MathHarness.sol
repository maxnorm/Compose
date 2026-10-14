// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

import "src/token/ERC20/Vault/Convert/ERC4626ConvertMod.sol" as ERC4626ConvertMod;

contract ERC4626MathHarness {
    function mulDiv(uint256 _x, uint256 _y, uint256 _denominator) external pure returns (uint256) {
        return ERC4626ConvertMod.mulDiv(_x, _y, _denominator);
    }

    function mulDivUp(uint256 _x, uint256 _y, uint256 _denominator) external pure returns (uint256) {
        return ERC4626ConvertMod.mulDivUp(_x, _y, _denominator);
    }

    function convertToShares(uint256 _assets, uint256 _totalAssets, uint256 _totalSupply)
        external
        pure
        returns (uint256)
    {
        return ERC4626ConvertMod.convertToShares(_assets, _totalAssets, _totalSupply);
    }

    function convertToAssets(uint256 _shares, uint256 _totalAssets, uint256 _totalSupply)
        external
        pure
        returns (uint256)
    {
        return ERC4626ConvertMod.convertToAssets(_shares, _totalAssets, _totalSupply);
    }
}
