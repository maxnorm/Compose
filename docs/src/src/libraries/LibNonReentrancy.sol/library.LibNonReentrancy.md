# LibNonReentrancy
[Git Source](https://github.com/maxnorm/Compose/blob/e3e377cf3d77e94dc30e10812da2bdd1907ca159/src/libraries/LibNonReentrancy.sol)

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

