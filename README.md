# Cascading Rives

## Instructions

You should run the backend, frontend and deploy the base layer contracts

First, start anvil

```shell
cd core/backend
make devnet
```

Then, deploy the world and core contracts.

```shell
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

Set the world address and the dapp address in `core/frontend/.env` and run the core frontend

```shell
cd core/frontend
make node_modules
make run-dev
```
