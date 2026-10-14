// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30 <0.9.0;

/* Compose
 * https://compose.diamonds
 */

import {Base_Test} from "test/Base.t.sol";
import {IERC4626} from "src/interfaces/IERC4626.sol";
import {ERC20ApproveFacet} from "src/token/ERC20/Approve/ERC20ApproveFacet.sol";
import {ERC20DataFacet} from "src/token/ERC20/Data/ERC20DataFacet.sol";
import {ERC4626AssetFacet} from "src/token/ERC20/Vault/Asset/ERC4626AssetFacet.sol";
import {ERC4626ConvertFacet} from "src/token/ERC20/Vault/Convert/ERC4626ConvertFacet.sol";
import {ERC4626DepositFacet} from "src/token/ERC20/Vault/Deposit/ERC4626DepositFacet.sol";
import {ERC4626MintFacet} from "src/token/ERC20/Vault/Mint/ERC4626MintFacet.sol";
import {ERC4626WithdrawFacet} from "src/token/ERC20/Vault/Withdraw/ERC4626WithdrawFacet.sol";
import {ERC4626RedeemFacet} from "src/token/ERC20/Vault/Redeem/ERC4626RedeemFacet.sol";
import {ERC4626MathHarness} from "test/utils/harnesses/token/ERC4626/ERC4626MathHarness.sol";
import {ERC4626DepositModHarness} from "test/utils/harnesses/token/ERC4626/ERC4626DepositModHarness.sol";
import {
    ERC4626FalseReturnAsset,
    ERC4626MockAsset,
    ERC4626NoReturnAsset
} from "test/utils/harnesses/token/ERC4626/ERC4626MockAsset.sol";
import {ERC4626VaultHarness} from "test/utils/harnesses/token/ERC4626/ERC4626VaultHarness.sol";

contract ERC4626Vault_Unit_Test is Base_Test {
    ERC4626MockAsset internal assetToken;
    ERC4626VaultHarness internal vaultHarness;
    IERC4626 internal vault;

    function setUp() public override {
        Base_Test.setUp();
        assetToken = new ERC4626MockAsset();
        vaultHarness = deployVault(address(assetToken));
        vault = IERC4626(address(vaultHarness));

        assetToken.mint(users.alice, 10_000 ether);
        assetToken.mint(users.bob, 10_000 ether);
    }

    function testDepositMintWithdrawAndRedeem() external {
        vm.startPrank(users.alice);
        assetToken.approve(address(vault), type(uint256).max);
        uint256 expectedShares = vault.previewDeposit(100 ether);
        assertEq(vault.deposit(100 ether, users.alice), expectedShares);
        vm.stopPrank();

        vm.startPrank(users.bob);
        assetToken.approve(address(vault), type(uint256).max);
        uint256 expectedMintAssets = vault.previewMint(20 ether);
        assertEq(vault.mint(20 ether, users.bob), expectedMintAssets);
        vm.stopPrank();

        vm.startPrank(users.alice);
        uint256 expectedWithdrawShares = vault.previewWithdraw(10 ether);
        assertEq(vault.withdraw(10 ether, users.receiver, users.alice), expectedWithdrawShares);
        vm.stopPrank();

        vm.startPrank(users.bob);
        uint256 expectedRedeemAssets = vault.previewRedeem(5 ether);
        assertEq(vault.redeem(5 ether, users.receiver, users.bob), expectedRedeemAssets);
        vm.stopPrank();

        assertEq(assetToken.balanceOf(users.receiver), 10 ether + expectedRedeemAssets);
        assertEq(vault.totalAssets(), assetToken.balanceOf(address(vault)));
    }

    function testFirstDepositorDonationDoesNotRoundVictimToZeroShares() external {
        vm.startPrank(users.alice);
        assetToken.approve(address(vault), type(uint256).max);
        assertGt(vault.deposit(1, users.alice), 0);
        assetToken.transfer(address(vault), 1_000 ether);
        vm.stopPrank();

        vm.startPrank(users.bob);
        assetToken.approve(address(vault), type(uint256).max);
        uint256 previewedShares = vault.previewDeposit(1_500 ether);
        uint256 mintedShares = vault.deposit(1_500 ether, users.bob);
        vm.stopPrank();

        assertGt(previewedShares, 0);
        assertEq(mintedShares, previewedShares);
        assertGt(vault.balanceOf(users.bob), 0);
    }

    function testWithdrawByApprovedSpenderConsumesShareAllowance() external {
        vm.startPrank(users.alice);
        assetToken.approve(address(vault), type(uint256).max);
        vault.deposit(10 ether, users.alice);
        uint256 shareAllowance = 20 ether;
        vault.approve(users.bob, shareAllowance);
        vm.stopPrank();

        vm.startPrank(users.bob);
        uint256 sharesBurned = vault.withdraw(1 ether, users.receiver, users.alice);
        vm.stopPrank();

        assertEq(vault.allowance(users.alice, users.bob), shareAllowance - sharesBurned);
        assertEq(assetToken.balanceOf(users.receiver), 1 ether);
    }

    function testNoReturnAssetTransferIsSupported() external {
        ERC4626NoReturnAsset noReturnAsset = new ERC4626NoReturnAsset();
        ERC4626VaultHarness noReturnVaultHarness = deployVault(address(noReturnAsset));
        IERC4626 noReturnVault = IERC4626(address(noReturnVaultHarness));
        noReturnAsset.mint(users.alice, 10 ether);

        vm.startPrank(users.alice);
        noReturnAsset.approve(address(noReturnVault), type(uint256).max);
        noReturnVault.deposit(5 ether, users.alice);
        uint256 redeemedAssets = noReturnVault.redeem(noReturnVault.balanceOf(users.alice), users.receiver, users.alice);
        vm.stopPrank();

        assertGt(redeemedAssets, 0);
        assertEq(noReturnAsset.balanceOf(users.receiver), redeemedAssets);
    }

    function testDepositRejectsFalseReturnFromAsset() external {
        ERC4626FalseReturnAsset falseReturnAsset = new ERC4626FalseReturnAsset();
        IERC4626 falseReturnVault = IERC4626(address(deployVault(address(falseReturnAsset))));
        vm.startPrank(users.alice);
        falseReturnAsset.approve(address(falseReturnVault), type(uint256).max);

        vm.expectRevert(
            abi.encodeWithSelector(
                ERC4626DepositFacet.ERC4626TransferFailed.selector,
                address(falseReturnAsset),
                users.alice,
                address(falseReturnVault),
                1 ether,
                abi.encode(false)
            )
        );
        falseReturnVault.deposit(1 ether, users.alice);
        vm.stopPrank();

        assertEq(falseReturnVault.totalSupply(), 0);
    }

    function testFullPrecisionMulDivAndRoundingUp() external {
        ERC4626MathHarness mathHarness = new ERC4626MathHarness();

        assertEq(mathHarness.mulDiv(type(uint256).max, type(uint256).max, type(uint256).max), type(uint256).max);
        assertEq(mathHarness.mulDivUp(10, 10, 6), 17);
        assertEq(mathHarness.mulDivUp(10, 10, 5), 20);
    }

    function testFuzz_MulDivMatchesNativeArithmetic(uint128 _x, uint128 _y, uint256 _denominator) external {
        ERC4626MathHarness mathHarness = new ERC4626MathHarness();
        _denominator = bound(_denominator, 1, type(uint256).max);
        uint256 product = uint256(_x) * uint256(_y);

        assertEq(mathHarness.mulDiv(_x, _y, _denominator), product / _denominator);
        uint256 expectedRoundedUp = product / _denominator;
        if (product % _denominator != 0) {
            expectedRoundedUp++;
        }
        assertEq(mathHarness.mulDivUp(_x, _y, _denominator), expectedRoundedUp);
    }

    function testFuzz_MulDivHandlesIntermediateOverflow(uint256 _value) external {
        ERC4626MathHarness mathHarness = new ERC4626MathHarness();

        assertEq(mathHarness.mulDiv(_value, type(uint256).max, type(uint256).max), _value);
    }

    function testConversionModuleAcceptsStrategyAwareAccountingTotals() external {
        ERC4626MathHarness mathHarness = new ERC4626MathHarness();

        assertEq(mathHarness.convertToShares(100, 200, 1_000), 502);
        assertEq(mathHarness.convertToAssets(100, 200, 1_000), 19);
    }

    function testDepositModuleUsesCallerVaultAndCustomAccountingTotal() external {
        ERC4626DepositModHarness modHarness = new ERC4626DepositModHarness(address(assetToken));
        assetToken.mint(users.alice, 100 ether);

        vm.startPrank(users.alice);
        assetToken.approve(address(modHarness), type(uint256).max);
        uint256 shares = modHarness.deposit(10 ether, users.alice, 200 ether);
        vm.stopPrank();

        assertGt(shares, 0);
        assertEq(assetToken.balanceOf(address(modHarness)), 10 ether);
    }

    function deployVault(address _asset) internal returns (ERC4626VaultHarness vaultInstance) {
        address[] memory facets = new address[](8);
        facets[0] = address(new ERC4626AssetFacet());
        facets[1] = address(new ERC4626ConvertFacet());
        facets[2] = address(new ERC4626DepositFacet());
        facets[3] = address(new ERC4626MintFacet());
        facets[4] = address(new ERC4626WithdrawFacet());
        facets[5] = address(new ERC4626RedeemFacet());
        facets[6] = address(new ERC20DataFacet());
        facets[7] = address(new ERC20ApproveFacet());
        vaultInstance = new ERC4626VaultHarness(facets, _asset);
    }
}
