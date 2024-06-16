// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { ResourceId, WorldResourceIdLib, WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";

import { SystemCallData } from "@latticexyz/world/src/modules/init/types.sol";
 
import { RESOURCE_SYSTEM } from "@latticexyz/world/src/worldResourceTypes.sol";

import { AccessControl } from "@latticexyz/world/src/AccessControl.sol";

import { ICartesiDApp, Proof } from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";


interface WorldWithFuncs {
  function setNamespaceSystem(address, ResourceId) external;
  function validateNotice(ResourceId,bytes calldata, uint32[] calldata, Proof[] calldata) external view returns (bool);
}

contract NftSystem is System {
  
  function prepareInput(bytes calldata ) public pure returns (bool) {

    // get namespace system from db by dapp address
    // ResourceId coreDappSystem = WorldResourceIdLib.encode(RESOURCE_SYSTEM, "core", "DappSystem");

    // TODO: perform any checks here, such as check for cartridge license
 
    // bool whether to send to  own input box
    return true;
  }

  function setDappAddress(address _dapp) public {

    // get namespace system from db by dapp address
    ResourceId coreDappSystem = WorldResourceIdLib.encode(RESOURCE_SYSTEM, "tapeNft", "NftSystem");

    // leave checks for dapp system
   
    // call the update set namespace for a dapp
    WorldWithFuncs(_world()).setNamespaceSystem(_dapp, coreDappSystem);
  }

  function validateNotice(
    bytes calldata _payload,
    uint32[] calldata _payloadSliceIndex,
    Proof[] calldata _proofs) external view returns (bool) 
  {
    // get own namespace system
    ResourceId coreDappSystem = WorldResourceIdLib.encode(RESOURCE_SYSTEM, "tapeNft", "NftSystem");

    return WorldWithFuncs(_world()).validateNotice(coreDappSystem, _payload, _payloadSliceIndex, _proofs);
  }

}
