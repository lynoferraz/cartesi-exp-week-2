# Watterfall of Rives

```
Cartesi Rollups Node version: 1.4.x (cartesi cli version 0.14.x)
```

This project is Proof of Concept to add base layer composability for Rives, and any other Cartesi Rollup DApps.
Base layer composability for Rives and other Cartesi Rollup DApps allows interesting features such as scaling the DApp by dividing it into specialized pieces, evolution by adding new features to a project without the need to hard fork it, and permissionless composability so the community can create new and unpredicted features.

We achieve this by designing a FRAMEWORK for CASCADES, so new Cartesi Rollups can subscribe to another rollup to receive the same inputs. By receiving the same inputs and running the same code from the subscribed rollup, the 2nd rollup effectively has immediate and automatic access to the main rollup without the need for any other request, or interaction (at the cost of running the same computation).

We used MUD framework to facilitate the base layer contracts development, the Cartesapp high-level framework, and the cartesi cli tool.

## Instructions

### Core

You should run the backend, frontend and deploy the base layer contracts

First, start anvil

```shell
cd core/backend
make devnet
```

Then, deploy the world and core contracts.

```shell
cd base-layer/core
pnpm install
pnpm mud tablegen
pnpm mud worldgen
pnpm mud deploy --rpc http://127.0.0.1:8545
```

It will generate a `worlds.json` file with the world address. Save it as it willl be your new InputBox Address. If you need to upgrade it, run `pnpm mud deploy --rpc http://127.0.0.1:8545 --worldAddress <address>`.

Also, get the InputBoxSystem addres from the logs (It should be `0x0b3940925df62Abe67fe9fC9cCDe949a29408C2b`). Set this address in `core/backend/.env`.

Then, build and deploy the core backend:

```shell
cd core/backend
make build
make deploy-devnet
```

It will print the deployed address and save it to `core/backend/dapp.json`

Then, start the core backend:

```shell
cd core/backend
make run-devnet
```

You should stop with `ctrl+C` then run `make stop-devnet`

Set the world address and the dapp address in `core/frontend/.env` and run the core frontend

```shell
cd core/frontend
make node_modules
make run-dev
```

### Extension

You'll have to do similar steps for each extension

Fisrt, deploy the extension contracts.

```shell
cd base-layer/nft-extension
pnpm install
pnpm mud tablegen
pnpm mud worldgen
WORLD_ADDRESS=<world_address> forge script script/TapeNftExtension.s.sol --rpc-url http://localhost:8545 --broadcast
```

Then, build and deploy the nft-extension backend:

```shell
cd nft-extension/backend
make build
make deploy-devnet
```

It will print the deployed address and save it to `nft-extension/backend/dapp.json`

Then, start the core backend:

```shell
cd nft-extension/backend
make run-devnet
```

Set the world address and the dapp address in `nft-extension/frontend/.env` and run the core frontend

```shell
cd nft-extension/frontend
make node_modules
make run-dev -p 3001
```
