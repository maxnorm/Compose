---
sidebar_position: 1
---

import DocSubtitle from '@site/src/components/docs/DocSubtitle';

# Installation

<DocSubtitle>Get up and running with Compose in just a few minutes.</DocSubtitle>

## Packages

Compose is published as two npm packages:

- **[`@perfect-abstractions/compose`](https://www.npmjs.com/package/@perfect-abstractions/compose)**: Solidity library
- **[`@perfect-abstractions/compose-cli`](https://www.npmjs.com/package/@perfect-abstractions/compose-cli)**: CLI to create Foundry or Hardhat diamond starter projects that use the library

## Prerequisites

- **Node.js >= 20**: required for the CLI and for npm-based Hardhat workflows
- **[Foundry](https://book.getfoundry.sh/getting-started/installation) (Optional)**: required if you use a Foundry scaffold or integrate Solidity with Forge
- **Git**: used by Foundry dependency installs inside generated projects

## Create a new project with Compose CLI

The fastest path is to run the CLI with `npx` (no global install):

```bash
npx @perfect-abstractions/compose-cli init
```

### Manual Installation

To install the CLI globally:

```bash
npm install -g @perfect-abstractions/compose-cli
compose init
```

## Add Compose to an existing project (Manual Installation)

### Foundry

```bash
forge install Perfect-Abstractions/Compose@tag=compose@0.0.2
```

Create a `remappings.txt` file in the root of your project with the following content:
```txt
@perfect-abstractions/compose/=lib/Compose/src/
```


### Hardhat / NPM

```bash
npm install @perfect-abstractions/compose
```

## Import Compose in your project

```solidity
import {DiamondMod} from "@perfect-abstractions/compose/diamond/DiamondMod.sol";
```

<!-- ## What's Next?

Now that you have Compose installed, let's understand the core concepts:

- **[Core Concepts](/)** - Learn about facets, libraries, and shared storage
- **[Quick Start Guide](/docs/getting-started/quick-start)** - Jump right in with a working example
- **[Your First Diamond](/docs/getting-started/your-first-diamond)** - Build a simple diamond with Compose facets -->

## Getting Help

Having trouble with installation?

- Check the **[FAQ](/)**
- Ask in **[Discord](https://discord.gg/compose)**
- Open an **[issue on GitHub](https://github.com/Perfect-Abstractions/Compose/issues)**

:::tip Development Environment
We recommend using VSCode with the [**Solidity** extension](https://github.com/juanfranblanco/vscode-solidity) by Juan Blanco for the best development experience.
:::

