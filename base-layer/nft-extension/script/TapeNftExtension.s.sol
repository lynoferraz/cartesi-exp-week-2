// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IBaseWorld } from "@latticexyz/world-modules/src/interfaces/IBaseWorld.sol";
 
import { WorldRegistrationSystem } from "@latticexyz/world/src/modules/init/implementations/WorldRegistrationSystem.sol";
 
// Create resource identifiers (for the namespace and system)
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";
import { RESOURCE_SYSTEM } from "@latticexyz/world/src/worldResourceTypes.sol";
 
// For registering the table
import { DappMessagesDebug,DebugCounter } from "../src/codegen/index.sol";
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
 
// For deploying MessageSystem
import { NftSystem } from "../src/systems/NftSystem.sol";
 
interface WorldWithFuncs {
  function addSystemSubscription(ResourceId, ResourceId) external ;
  function tapeNft__setDappAddress(address) external;
}

contract TapeNftExtension is Script {
 function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address worldAddress = vm.envAddress("WORLD_ADDRESS");
 
    WorldRegistrationSystem world = WorldRegistrationSystem(worldAddress);
    ResourceId namespaceResource = WorldResourceIdLib.encodeNamespace(bytes14("tapeNft"));
    ResourceId systemResource = WorldResourceIdLib.encode(RESOURCE_SYSTEM, "tapeNft", "NftSystem");
 
    vm.startBroadcast(deployerPrivateKey);

    world.registerNamespace(namespaceResource);
 
    StoreSwitch.setStoreAddress(worldAddress);
    DebugCounter.register();
    DappMessagesDebug.register();
 
    NftSystem nftSystem = new NftSystem();
    console.log("NftSystem address: ", address(nftSystem));
 
    world.registerSystem(systemResource, nftSystem, true);

    world.registerFunctionSelector(systemResource, "setDappAddress(address)");

    ResourceId nftDappSystem = WorldResourceIdLib.encode(RESOURCE_SYSTEM, "tapeNft", "NftSystem");
    ResourceId coreDappSystem = WorldResourceIdLib.encode(RESOURCE_SYSTEM, "core", "CoreSystem");
    console.logString("nftDappSystem");
    console.logBytes(abi.encodePacked(nftDappSystem));
    console.logString("coreDappSystem");
    console.logBytes(abi.encodePacked(coreDappSystem));
    console.log("debug 3");
    WorldWithFuncs(worldAddress).tapeNft__setDappAddress(0xe46081b4EfcE0eBa40f4d5FAf9847c3303bD9393);

    console.log("debug 4");
    WorldWithFuncs(worldAddress).addSystemSubscription(nftDappSystem, coreDappSystem);

    vm.stopBroadcast();
  }
}
