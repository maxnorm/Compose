// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

contract ERC4626MockAsset {
    mapping(address account => uint256 balance) public balanceOf;
    mapping(address owner => mapping(address spender => uint256 allowance)) public allowance;

    function decimals() external pure returns (uint8) {
        return 18;
    }

    function mint(address _to, uint256 _amount) external {
        balanceOf[_to] += _amount;
    }

    function approve(address _spender, uint256 _amount) external returns (bool) {
        allowance[msg.sender][_spender] = _amount;
        return true;
    }

    function transfer(address _to, uint256 _amount) external returns (bool) {
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount) external returns (bool) {
        uint256 currentAllowance = allowance[_from][msg.sender];
        if (currentAllowance != type(uint256).max) {
            allowance[_from][msg.sender] = currentAllowance - _amount;
        }
        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;
        return true;
    }
}

contract ERC4626NoReturnAsset {
    mapping(address account => uint256 balance) public balanceOf;
    mapping(address owner => mapping(address spender => uint256 allowance)) public allowance;

    function mint(address _to, uint256 _amount) external {
        balanceOf[_to] += _amount;
    }

    function approve(address _spender, uint256 _amount) external {
        allowance[msg.sender][_spender] = _amount;
    }

    function transfer(address _to, uint256 _amount) external {
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
    }

    function transferFrom(address _from, address _to, uint256 _amount) external {
        uint256 currentAllowance = allowance[_from][msg.sender];
        if (currentAllowance != type(uint256).max) {
            allowance[_from][msg.sender] = currentAllowance - _amount;
        }
        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;
    }
}

contract ERC4626FalseReturnAsset {
    mapping(address account => uint256 balance) public balanceOf;

    function approve(address, uint256) external pure returns (bool) {
        return true;
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        return false;
    }
}
