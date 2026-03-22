---
sidebar_position: 1
---

# Installation

Get up and running with Composein your own project.

## CLI Installation

```bash
npm install -g @perfect-abstractions/compose-cli
```

Start a new project:

```bash
compose init
```

Use `compose --help` for options.

## Manual Installation

### Install with Foundry

Before you begin, make sure you have:

- **[Foundry](https://book.getfoundry.sh/getting-started/installation)**
- **Git** (for resolving submodules dependencies)

Install Compose into an existing Foundry project:

```bash
forge install Perfect-Abstractions/Compose@v0.1.0
```

Then configure a `remappings.txt` file at your project root with the following line:
```text
@perfect-abstractions/compose/=lib/compose/src/
```

### Install with Hardhat (npm)

Before you begin, make sure you have:
- **[Hardhat](https://hardhat.org/docs/getting-started)**
- **[Node.js](https://nodejs.org/)**

Install Compose into an existing Hardhat project by running:
```bash
npm install @perfect-abstractions/compose

```

## Importing in Solidity

Once installed, you can import Compose facets and libraries in your Solidity files. For example:

```solidity
import { DiamondMod } from "@perfect-abstractions/compose/diamond/DiamondMod.sol";

contract MyDiamond {
    constructor(_facets: address[]) {
        DiamondMod.addFacets(_facets);
    }

    fallback() external payable {
        DiamondMod.diamondFallback();
    }
}
```

## Working on Compose Itself

If you want to help us improve Compose, you can work on the codebase by following the **[How to Contribute](/docs/contribution/how-to-contribute)** guide for full development setup instructions.

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
We recommend using VSCode with the **Solidity** extension by Juan Blanco for the best development experience.
:::

