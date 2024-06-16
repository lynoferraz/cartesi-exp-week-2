# Makefile

ENVFILE := .env
DEPLOY_ENVFILE := .localhost.env
RECEIPT_FILE := .tx-receipt
DAPP_FILE := dapp.json

SHELL := /bin/bash

RIV_VERSION := 0.3-rc12
CARTESI_SDK_RIV_VERSION := 0.6.2-riv

RIVES_VERSION := $(shell git log -1 --format="%at" | xargs -I{} date -d @{} +%Y%m%d.%H%M).$(shell git rev-parse --short HEAD)


define setup_venv =
@if [ ! -d .venv ]; then python3 -m venv .venv; fi
@if [[ "VIRTUAL_ENV" != "" ]]; then . .venv/bin/activate; fi
@if [ -z "$(pip freeze)" ]; then
	if [ -f requirements.txt ]; then 
		pip install -r requirements.txt
		pip install git+https://github.com/prototyp3-dev/cartesapp@main#egg=cartesapp[dev] --find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/
		pip install pytest-order
	else
		pip install git+https://github.com/prototyp3-dev/cartesapp@main --find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/
		echo --find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/ >> requirements.txt
		pip install py-expression-eval
		pip freeze >> requirements.txt
		pip install git+https://github.com/prototyp3-dev/cartesapp@main#egg=cartesapp[dev] --find-links https://prototyp3-dev.github.io/pip-wheels-riscv/wheels/
		pip install pytest-order
	fi
fi
endef

.ONESHELL:

all: cartesi-riv build build-reader-node

setup-env: ; $(value setup_venv)

# build targets
build: --load-env --check-opaddr-env --check-pxaddr-env ; $(value setup_venv)
	cartesapp build --config user=root --config envs=OPERATOR_ADDRESS=${OPERATOR_ADDRESS},RIVES_VERSION=${RIVES_VERSION},PROXY_ADDRESS=${PROXY_ADDRESS} $(ARGS)

build-reader-node: ; $(value setup_venv)
	cartesapp build-reader-image $(ARGS)

build-dev-node: ; $(value setup_venv)
	cartesapp build-dev-image $(ARGS)

build-%: ${ENVFILE}.% --check-envs-% ; $(value setup_venv)
	. $< && cartesapp build --config user=root --config envs=OPERATOR_ADDRESS=${OPERATOR_ADDRESS},RIVES_VERSION=${RIVES_VERSION},PROXY_ADDRESS=${PROXY_ADDRESS} $(ARGS)

# Run targets
run: --load-env --check-rivemu-env --check-opaddr-env --check-roladdr-env --check-pxaddr-env ; $(value setup_venv)
	cartesapp node $(ARGS)

devnet:
	docker run --name anvil --rm --env ANVIL_IP_ADDR=0.0.0.0 -p 8545:8545 cartesi/sdk:0.6.0 devnet --block-time 2 --silent

deploy-devnet: --deploy-devnet --test-receipt
	@$(eval DAPP_ADDRESS := $(shell cat ${RECEIPT_FILE} | jq '.logs[-1].data' | xargs cast abi-decode "x()(address,bytes32,address)" | tail -1))
	@$(eval CONSENSUS_ADDRESS := $(shell cat ${RECEIPT_FILE} | jq '.logs[-1].topics[1]' | xargs cast abi-decode "x()(address)" | tail -1))
	@$(eval HISTORY_ADDRESS := $(shell cast call ${CONSENSUS_ADDRESS} "getHistory()" |  xargs cast abi-decode "x()(address)" | tail -1))
	@$(eval BLOCK_HASH := $(shell cat ${RECEIPT_FILE} | jq -r '.blockHash'))
	@$(eval BLOCK_NUMBER := $(shell cat ${RECEIPT_FILE} | jq -r '.blockNumber' | xargs printf "%d"))
	@$(eval TX_HASH := $(shell cat ${RECEIPT_FILE} | jq -r '.transactionHash'))
	@echo '{"address":"'${DAPP_ADDRESS}'","consensus_address":"'${CONSENSUS_ADDRESS}'","history_address":"'${HISTORY_ADDRESS}'","blockHash":"'${BLOCK_HASH}'","blockNumber":'${BLOCK_NUMBER}',"transactionHash":"'${TX_HASH}'"}' | jq > ${DAPP_FILE}
	@cat ${DAPP_FILE}
	@rm ${RECEIPT_FILE} 

--test-receipt:
	@if [ ! -s ${RECEIPT_FILE}  ]; then rm ${RECEIPT_FILE} ; echo "Error Deploying"; exit 1; fi

--deploy-devnet: --load-deploy-env
	@$(eval MACHINE_HASH := $(shell xxd -p -c32 .cartesi/image/hash))
	@$(eval PROJECT_NAME := $(shell echo ${MACHINE_HASH} | cut -c 2-10))
	@PRIV_KEY="${PRIV_KEY}" FACTORY_ADDRESS="${FACTORY_ADDRESS}" MACHINE_HASH="${MACHINE_HASH}" \
	 docker compose -f docker-compose-anvil.yaml --project-name ${PROJECT_NAME} up --quiet-pull --no-log-prefix dapp_deployer | grep -v dapp_deployer | cat > ${RECEIPT_FILE}
	@PRIV_KEY="${PRIV_KEY}" FACTORY_ADDRESS="${FACTORY_ADDRESS}" MACHINE_HASH="${MACHINE_HASH}" \
	 docker compose -f docker-compose-anvil.yaml --project-name ${PROJECT_NAME} down dapp_deployer

CLI_PATH :=  $(shell find ${HOME}/.nvm -path "*@cartesi/cli/dist")
CLI_NODE_PATH :=  ${CLI_PATH}/node

run-devnet: ${DAPP_FILE} --load-deploy-env
	@$(eval DAPP_ADDRESS := $(shell cat ${DAPP_FILE} | jq -r '.address'))
	@$(eval CONSENSUS_ADDRESS := $(shell cat ${DAPP_FILE} | jq -r '.consensus_address'))
	@$(eval HISTORY_ADDRESS := $(shell cat ${DAPP_FILE} | jq -r '.history_address'))
	@$(eval BLOCK_HASH := $(shell cat ${DAPP_FILE} | jq -r '.blockHash'))
	@$(eval MACHINE_HASH := $(shell xxd -p -c32 .cartesi/image/hash))
	@$(eval PROJECT_NAME := $(shell echo ${MACHINE_HASH} | cut -c 2-10))
	PRIV_KEY="${PRIV_KEY}" FACTORY_ADDRESS="${FACTORY_ADDRESS}" \
	 CARTESI_LISTEN_PORT=8080 CARTESI_SNAPSHOT_DIR=/usr/share/rollups-node/snapshot CARTESI_BIN_PATH=${CLI_PATH} \
	 CARTESI_CONTRACTS_APPLICATION_ADDRESS=${DAPP_ADDRESS} CARTESI_CONTRACTS_APPLICATION_DEPLOYMENT_BLOCK_NUMBER=${BLOCK_NUMBER} \
	 CARTESI_CONTRACTS_AUTHORITY_ADDRESS=${CONSENSUS_ADDRESS}  CARTESI_CONTRACTS_HISTORY_ADDRESS=${HISTORY_ADDRESS} \
	 CARTESI_LISTEN_PORT=8081 \
	 CARTESI_BLOCKCHAIN_HTTP_ENDPOINT="http://host.docker.internal:8545" CARTESI_BLOCKCHAIN_WS_ENDPOINT="ws://host.docker.internal:8545" \
	 docker compose -f docker-compose-anvil.yaml -f ${CLI_NODE_PATH}/docker-compose-database.yaml -f ${CLI_NODE_PATH}/docker-compose-snapshot-volume.yaml \
	 -f ${CLI_NODE_PATH}/docker-compose-explorer.yaml -f ${CLI_NODE_PATH}/docker-compose-proxy.yaml -f docker-compose-validator.yaml \
	  --project-name ${PROJECT_NAME} --project-directory . \
	  up traefik-config-generator database database_creator prompt validator proxy --attach prompt --attach validator


stop-devnet:
	@$(eval MACHINE_HASH := $(shell xxd -p -c32 .cartesi/image/hash))
	@$(eval PROJECT_NAME := $(shell echo ${MACHINE_HASH} | cut -c 2-10))
	CARTESI_LISTEN_PORT=8080 CARTESI_SNAPSHOT_DIR=/usr/share/rollups-node/snapshot CARTESI_BIN_PATH=${CLI_PATH} \
	 docker compose -f ${CLI_NODE_PATH}/docker-compose-database.yaml \
	 -f ${CLI_NODE_PATH}/docker-compose-explorer.yaml -f ${CLI_NODE_PATH}/docker-compose-proxy.yaml -f docker-compose-validator.yaml \
	 --project-name ${PROJECT_NAME} --project-directory . down


run-dev: --load-env --check-rivemu-env --check-opaddr-env --check-roladdr-env rivemu --check-pxaddr-env ; $(value setup_venv)
	RIVEMU_PATH=${RIVEMU_PATH} OPERATOR_ADDRESS=${OPERATOR_ADDRESS} PROXY_ADDRESS=${PROXY_ADDRESS} ROLLUP_HTTP_SERVER_URL=${ROLLUP_HTTP_SERVER_URL} cartesapp node --mode dev $(ARGS)

run-reader: ; $(value setup_venv)
	cartesapp node --mode reader $(ARGS)

run-dev-%: ${ENVFILE}.% --check-testnet-envs-% --check-dev-envs-% rivemu ; $(value setup_venv)
	. $< && RIVEMU_PATH=${RIVEMU_PATH} OPERATOR_ADDRESS=${OPERATOR_ADDRESS} PROXY_ADDRESS=${PROXY_ADDRESS} ROLLUP_HTTP_SERVER_URL=${ROLLUP_HTTP_SERVER_URL} \
	 cartesapp node --mode dev --config rpc-url=${RPC_URL} --config contracts-application-address=${DAPP_ADDRESS} --config contracts-input-box-block=${DAPP_DEPLOY_BLOCK} \
	 $(ARGS)

run-reader-%: ${ENVFILE}.% --check-testnet-envs-% ; $(value setup_venv)
	. $< && cartesapp node --mode reader --config rpc-url=${RPC_URL} --config contracts-application-address=${DAPP_ADDRESS} --config contracts-input-box-block=${DAPP_DEPLOY_BLOCK} $(ARGS)

run-frontend-dev:
	@test ! -z '${FRONTEND_PATH}' || echo "Must define FRONTEND_PATH in env" && test ! -z '${FRONTEND_PATH}'
	make -C ${FRONTEND_PATH} run-dev

build-frontend:
	@test ! -z '${FRONTEND_PATH}' || echo "Must define FRONTEND_PATH in env" && test ! -z '${FRONTEND_PATH}'
	make -C ${FRONTEND_PATH} build

generate-frontend-libs: ; $(value setup_venv)
	@test ! -z '${FRONTEND_PATH}' || echo "Must define FRONTEND_PATH in env" && test ! -z '${FRONTEND_PATH}'
	cartesapp generate-frontend-libs --libs-path app/backend-libs --frontend-path ${FRONTEND_PATH}

# Aux env targets
--load-env: ${ENVFILE}
	$(eval include include $(PWD)/${ENVFILE})

${ENVFILE}:
	@test ! -f $@ && echo "$(ENVFILE) not found. Creating with default values" 
	echo ROLLUP_HTTP_SERVER_URL=http://localhost:8080/rollup >> $(ENVFILE)
	echo RIVEMU_PATH=rivemu >> $(ENVFILE)
	echo OPERATOR_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 >> $(ENVFILE)
	echo PROXY_ADDRESS=0x0b3940925df62Abe67fe9fC9cCDe949a29408C2b >> $(ENVFILE)

--load-env-%: ${ENVFILE}.%
	@$(eval include include $^)

${ENVFILE}.%:
	test ! -f $@ && $(error "file $@ doesn't exist")

--load-deploy-env: ${DEPLOY_ENVFILE}
	$(eval include include $(PWD)/${DEPLOY_ENVFILE})

${DEPLOY_ENVFILE}:
	@test ! -f $@ && echo "$(DEPLOY_ENVFILE) not found. Creating with default values" 
	echo FACTORY_ADDRESS=0x9E32e06Fd23675b2DF8eA8e6b0A25c3DF6a60AbC >> $(DEPLOY_ENVFILE)
	echo PRIV_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 >> $(DEPLOY_ENVFILE)
	echo OPERATOR_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 >> $(DEPLOY_ENVFILE)
# 	echo export NETWORK=localhost >> $(DEPLOY_ENVFILE)
# 	echo export RPC_URL=http://127.0.0.1:8545 >> $(DEPLOY_ENVFILE)
# 	echo export WSS_URL=wss://127.0.0.1:8545 >> $(DEPLOY_ENVFILE)
# 	echo export CHAIN_ID=31337 >> $(DEPLOY_ENVFILE)

--check-roladdr-env:
	@test ! -z '${ROLLUP_HTTP_SERVER_URL}' || echo "Must define ROLLUP_HTTP_SERVER_URL in env" && test ! -z '${ROLLUP_HTTP_SERVER_URL}'


# custom rives tagets

--check-envs-%: --load-env-%
	@test ! -z '${OPERATOR_ADDRESS}' || echo "Must define OPERATOR_ADDRESS in env" && test ! -z '${OPERATOR_ADDRESS}'

--check-rivemu-env:
	@test ! -z '${RIVEMU_PATH}' || echo "Must define RIVEMU_PATH in env" && test ! -z '${RIVEMU_PATH}'

--check-opaddr-env:
	@test ! -z '${OPERATOR_ADDRESS}' || echo "Must define OPERATOR_ADDRESS in env" && test ! -z '${OPERATOR_ADDRESS}'

--check-pxaddr-env:
	@test ! -z '${PROXY_ADDRESS}' || echo "Must define PROXY_ADDRESS in env" && test ! -z '${PROXY_ADDRESS}'

--check-dev-envs-%: --load-env-%
	@test ! -z '${OPERATOR_ADDRESS}' || echo "Must define OPERATOR_ADDRESS in env" && test ! -z '${OPERATOR_ADDRESS}'
	@test ! -z '${PROXY_ADDRESS}' || echo "Must define PROXY_ADDRESS in env" && test ! -z '${PROXY_ADDRESS}'
	@test ! -z '${RIVEMU_PATH}' || echo "Must define RIVEMU_PATH in env" && test ! -z '${RIVEMU_PATH}'
	@test ! -z '${ROLLUP_HTTP_SERVER_URL}' || echo "Must define ROLLUP_HTTP_SERVER_URL in env" && test ! -z '${ROLLUP_HTTP_SERVER_URL}'

--check-testnet-envs-%: --load-env-%
	@test ! -z '${RPC_URL}' || echo "Must define RPC_URL in env" && test ! -z '${RPC_URL}'
	@test ! -z '${DAPP_ADDRESS}' || echo "Must define DAPP_ADDRESS in env" && test ! -z '${DAPP_ADDRESS}'
	@test ! -z '${DAPP_DEPLOY_BLOCK}' || echo "Must define DAPP_DEPLOY_BLOCK in env" && test ! -z '${DAPP_DEPLOY_BLOCK}'

cartesi-riv: cartesi-sdk
cartesi-sdk-riv: cartesi-sdk
cartesi-sdk:
	docker build --tag cartesi/sdk:${CARTESI_SDK_RIV_VERSION} --target cartesi-riv-sdk .

rivemu:
	curl -s -L https://github.com/rives-io/riv/releases/download/v${RIV_VERSION}/rivemu-linux-$(shell dpkg --print-architecture) -o rivemu
	chmod +x rivemu

--remove-rivemu:
	rm -rf rivemu

update-rivemu: --remove-rivemu rivemu

update-frontend-rivemu:
	@test ! -z '${FRONTEND_PATH}' || echo "Must define FRONTEND_PATH in env" && test ! -z '${FRONTEND_PATH}'
	curl -s -L https://github.com/rives-io/riv/releases/download/v${RIV_VERSION}/rivemu.js -o ${FRONTEND_PATH}/public/rivemu.js
	curl -s -L https://github.com/rives-io/riv/releases/download/v${RIV_VERSION}/rivemu.wasm -o ${FRONTEND_PATH}/public/rivemu.wasm

build-release:
	IMAGE_VERSION=$$(git log -1 --format="%at" | xargs -I{} date -d @{} +%Y%m%d.%H%M).$$(git rev-parse --short HEAD)
	IMAGE_TAG=ghcr.io/rives-io/rives-core:$$IMAGE_VERSION
	echo $$IMAGE_TAG > .rives-core.tag
	docker build -f Dockerfile --target node .cartesi/ \
		-t $$IMAGE_TAG \
		--label "org.opencontainers.image.title=rives-core" \
		--label "org.opencontainers.image.description=RIVES Core Node" \
		--label "org.opencontainers.image.source=https://github.com/rives-io/rives-core" \
		--label "org.opencontainers.image.revision=$$(git rev-parse HEAD)" \
		--label "org.opencontainers.image.created=$$(date -Iseconds --utc)" \
		--label "org.opencontainers.image.licenses=Apache-2.0" \
		--label "org.opencontainers.image.url=https://rives.io" \
		--label "org.opencontainers.image.version=$$IMAGE_VERSION"

# Test targets
test-verbose: --load-env --check-rivemu-env ; $(value setup_venv)
	RIVEMU_PATH=${RIVEMU_PATH} pytest --capture=no --log-cli-level=DEBUG --maxfail=1 --order-dependencies


run-external-verifier:
	make -C external_verifier run ARGS='$(ARGS)'

run-external-verifier-cloud-services:
	make -C external_verifier run-cloud-services ARGS='$(ARGS)'

build-external-verifier-cloud:
	IMAGE_VERSION=$$(git log -1 --format="%at" | xargs -I{} date -d @{} +%Y%m%d.%H%M).$$(git rev-parse --short HEAD)
	IMAGE_TAG=ghcr.io/rives-io/rives-exteral-verifier:$$IMAGE_VERSION
	echo $$IMAGE_TAG > .external-verifier-cloud.tag
	docker build --target external-verifier-cloud . \
		-t $$IMAGE_TAG \
		--label "org.opencontainers.image.title=rives-external-verifier" \
		--label "org.opencontainers.image.description=RIVES External Verifier" \
		--label "org.opencontainers.image.source=https://github.com/rives-io/rives-core" \
		--label "org.opencontainers.image.revision=$$(git rev-parse HEAD)" \
		--label "org.opencontainers.image.created=$$(date -Iseconds --utc)" \
		--label "org.opencontainers.image.licenses=Apache-2.0" \
		--label "org.opencontainers.image.url=https://rives.io" \
		--label "org.opencontainers.image.version=$$IMAGE_VERSION"
