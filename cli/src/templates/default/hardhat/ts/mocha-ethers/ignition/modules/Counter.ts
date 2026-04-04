import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CounterDiamondModule", (m) => {
  const counterFacet = m.contract("CounterFacet");
  const inspectFacet = m.contract("DiamondInspectFacet");
  const upgradeFacet = m.contract("DiamondUpgradeFacet");

  const owner = m.getAccount(0);
  const diamond = m.contract("Diamond", [[counterFacet, inspectFacet, upgradeFacet], owner]);

  return { diamond, counterFacet, inspectFacet, upgradeFacet };
});
