# LibNonReentrancy
[Git Source](https://github.com/maxnorm/Compose/blob/6956906c9ed86d52ca90b8f2deea310beff37f02/src/libraries/LibNonReentrancy.sol)

**Title:**
LibNonReentrancy - Non-Reentrancy Library

Provides common non-reentrant functions for Solidity contracts.


## State Variables
### NON_REENTRANT_SLOT

```solidity
bytes32 constant NON_REENTRANT_SLOT = keccak256("compose.nonreentrant")
```


## Functions
### enter

How to use as a library in user facets

How to use as a modifier in user facets

This unlocks the entry into a function


```solidity
function enter() internal;
```

### exit

This locks the entry into a function


```solidity
function exit() internal;
```

## Errors
### Reentrancy

```solidity
error Reentrancy();
```

