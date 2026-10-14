// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

/* Compose
 * https://compose.diamonds
 */

/**
 * @title ERC-4626 Tokenized Vault Interface
 * @notice Interface for the synchronous ERC-4626 vault operations.
 */
interface IERC4626 {
    /**
     * @notice The deposit request exceeds the receiver's maximum.
     */
    error ERC4626ExceededMaxDeposit(address _receiver, uint256 _assets, uint256 _max);
    /**
     * @notice The mint request exceeds the receiver's maximum.
     */
    error ERC4626ExceededMaxMint(address _receiver, uint256 _shares, uint256 _max);
    /**
     * @notice The withdrawal request exceeds the owner's maximum.
     */
    error ERC4626ExceededMaxWithdraw(address _owner, uint256 _assets, uint256 _max);
    /**
     * @notice The redemption request exceeds the owner's maximum.
     */
    error ERC4626ExceededMaxRedeem(address _owner, uint256 _shares, uint256 _max);

    /**
     * @notice Emitted when the share token transfers shares.
     */
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    /**
     * @notice Emitted when a share allowance is set.
     */
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    /**
     * @notice Emitted when assets are deposited and shares are minted.
     * @param _sender The address that initiated the deposit.
     * @param _owner The address receiving the shares.
     * @param _assets The amount of assets deposited.
     * @param _shares The amount of shares minted.
     */
    event Deposit(address indexed _sender, address indexed _owner, uint256 _assets, uint256 _shares);

    /**
     * @notice Emitted when shares are burned and assets are withdrawn.
     * @param _sender The address that initiated the withdrawal.
     * @param _receiver The address receiving the assets.
     * @param _owner The address whose shares were burned.
     * @param _assets The amount of assets withdrawn.
     * @param _shares The amount of shares burned.
     */
    event Withdraw(
        address indexed _sender, address indexed _receiver, address indexed _owner, uint256 _assets, uint256 _shares
    );

    /**
     * @notice Returns the share token name.
     */
    function name() external view returns (string memory);

    /**
     * @notice Returns the share token symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @notice Returns the share token decimals.
     */
    function decimals() external view returns (uint8);

    /**
     * @notice Returns the total number of shares.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @notice Returns the share balance of an owner.
     */
    function balanceOf(address _owner) external view returns (uint256);

    /**
     * @notice Transfers shares to a recipient.
     */
    function transfer(address _to, uint256 _value) external returns (bool);

    /**
     * @notice Returns an owner's remaining share allowance for a spender.
     */
    function allowance(address _owner, address _spender) external view returns (uint256);

    /**
     * @notice Sets a share allowance for a spender.
     */
    function approve(address _spender, uint256 _value) external returns (bool);

    /**
     * @notice Transfers shares using an owner's allowance.
     */
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool);

    /**
     * @notice Returns the address of the underlying asset token.
     */
    function asset() external view returns (address);

    /**
     * @notice Returns the total underlying assets managed by the vault.
     */
    function totalAssets() external view returns (uint256);

    /**
     * @notice Converts assets to shares, rounding down.
     */
    function convertToShares(uint256 _assets) external view returns (uint256);

    /**
     * @notice Converts shares to assets, rounding down.
     */
    function convertToAssets(uint256 _shares) external view returns (uint256);

    /**
     * @notice Returns the maximum amount of assets that can be deposited for a receiver.
     */
    function maxDeposit(address _receiver) external view returns (uint256);

    /**
     * @notice Returns shares expected for a deposit, rounding down.
     */
    function previewDeposit(uint256 _assets) external view returns (uint256);

    /**
     * @notice Deposits assets and mints shares to the receiver.
     */
    function deposit(uint256 _assets, address _receiver) external returns (uint256);

    /**
     * @notice Returns the maximum number of shares that can be minted for a receiver.
     */
    function maxMint(address _receiver) external view returns (uint256);

    /**
     * @notice Returns assets required to mint shares, rounding up.
     */
    function previewMint(uint256 _shares) external view returns (uint256);

    /**
     * @notice Mints shares to a receiver by depositing assets.
     */
    function mint(uint256 _shares, address _receiver) external returns (uint256);

    /**
     * @notice Returns the maximum amount of assets that can be withdrawn by an owner.
     */
    function maxWithdraw(address _owner) external view returns (uint256);

    /**
     * @notice Returns shares required to withdraw assets, rounding up.
     */
    function previewWithdraw(uint256 _assets) external view returns (uint256);

    /**
     * @notice Withdraws assets to a receiver and burns the owner's shares.
     */
    function withdraw(uint256 _assets, address _receiver, address _owner) external returns (uint256);

    /**
     * @notice Returns the maximum number of shares that can be redeemed by an owner.
     */
    function maxRedeem(address _owner) external view returns (uint256);

    /**
     * @notice Returns assets expected for a redemption, rounding down.
     */
    function previewRedeem(uint256 _shares) external view returns (uint256);

    /**
     * @notice Redeems shares from an owner and transfers assets to the receiver.
     */
    function redeem(uint256 _shares, address _receiver, address _owner) external returns (uint256);
}
