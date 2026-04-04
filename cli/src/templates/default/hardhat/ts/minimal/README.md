# {{projectName}}

Hardhat 3 diamond starter scaffolded by the [Compose CLI](https://github.com/Perfect-Abstractions/Compose). Project can use the `@perfect-abstractions/compose` library for diamond infrastructure facets.

Includes:
- `contracts/Diamond.sol` using Compose `DiamondMod` and `OwnerMod`
- `contracts/facets/CounterFacet.sol` with `increment`, `getCounter`, and `exportSelectors`

Deploy each facet contract first, then deploy `Diamond` by passing the facet addresses and the owner address to the constructor.

### Links
- [Docs](https://hardhat.org/docs/)
- [GitHub](https://github.com/NomicFoundation/hardhat)

## Hardhat Usage
### Build
```sh
npx hardhat build
```

### Test
```sh
npx hardhat test
```

### Local node
```sh
npx hardhat node
```

This will launch a JSON-RPC server locally at `http://127.0.0.1:8545`

### Help
```sh
npx hardhat --help
```