// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

/**
 * @notice Thrown when a full-precision multiplication result cannot fit in uint256.
 */
error ERC4626MathOverflow();

uint256 constant VIRTUAL_ASSET = 1;
uint256 constant VIRTUAL_SHARES = 10;

/**
 * @notice Computes floor(_x * _y / _denominator) with full precision.
 * @dev Based on Remco Bloemen's mulDiv algorithm: https://xn--2-umb.com/21/muldiv/.
 */
function mulDiv(uint256 _x, uint256 _y, uint256 _denominator) pure returns (uint256 result) {
    uint256 prod0;
    uint256 prod1;
    assembly {
        let mm := mulmod(_x, _y, not(0))
        prod0 := mul(_x, _y)
        prod1 := sub(sub(mm, prod0), lt(mm, prod0))
    }

    if (prod1 == 0) {
        return prod0 / _denominator;
    }
    if (_denominator <= prod1) {
        revert ERC4626MathOverflow();
    }

    unchecked {
        uint256 remainder;
        assembly {
            remainder := mulmod(_x, _y, _denominator)
            prod1 := sub(prod1, gt(remainder, prod0))
            prod0 := sub(prod0, remainder)
        }

        uint256 twos = _denominator & (0 - _denominator);
        assembly {
            _denominator := div(_denominator, twos)
            prod0 := div(prod0, twos)
            twos := add(div(sub(0, twos), twos), 1)
        }

        prod0 |= prod1 * twos;
        uint256 inverse = (3 * _denominator) ^ 2;
        inverse *= 2 - _denominator * inverse;
        inverse *= 2 - _denominator * inverse;
        inverse *= 2 - _denominator * inverse;
        inverse *= 2 - _denominator * inverse;
        inverse *= 2 - _denominator * inverse;
        inverse *= 2 - _denominator * inverse;
        result = prod0 * inverse;
    }
}

/**
 * @notice Computes ceil(_x * _y / _denominator) with full precision.
 */
function mulDivUp(uint256 _x, uint256 _y, uint256 _denominator) pure returns (uint256 result) {
    result = mulDiv(_x, _y, _denominator);
    if (mulmod(_x, _y, _denominator) != 0) {
        if (result == type(uint256).max) {
            revert ERC4626MathOverflow();
        }
        result++;
    }
}

/**
 * @notice Converts an asset amount to shares using caller-supplied accounting totals.
 * @dev Supplying `_totalAssets` lets strategy facets include assets held outside the diamond.
 */
function convertToShares(uint256 _assets, uint256 _totalAssets, uint256 _totalSupply) pure returns (uint256) {
    return mulDiv(_assets, _totalSupply + VIRTUAL_SHARES, _totalAssets + VIRTUAL_ASSET);
}

/**
 * @notice Converts a share amount to assets using caller-supplied accounting totals.
 * @dev Rounds down, as required by ERC-4626.
 */
function convertToAssets(uint256 _shares, uint256 _totalAssets, uint256 _totalSupply) pure returns (uint256) {
    return mulDiv(_shares, _totalAssets + VIRTUAL_ASSET, _totalSupply + VIRTUAL_SHARES);
}
