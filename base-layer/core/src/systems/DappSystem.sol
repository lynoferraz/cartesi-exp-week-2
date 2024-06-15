// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { ResourceId, ResourceIdInstance, WorldResourceIdLib, WorldResourceIdInstance } from "@latticexyz/world/src/WorldResourceId.sol";

import { SystemCallData } from "@latticexyz/world/src/modules/init/types.sol";
 
import { RESOURCE_SYSTEM } from "@latticexyz/world/src/worldResourceTypes.sol";
import { NamespaceOwner } from "@latticexyz/world/src/codegen/tables/NamespaceOwner.sol";

import { IWorld } from "../codegen/world/IWorld.sol";

import "@latticexyz/world/src/worldResourceTypes.sol";
import { AccessControl } from "@latticexyz/world/src/AccessControl.sol";

import { DappAddressNamespace, NamespaceDappAddress, NamespaceSubscriptions, NamespaceDependencies, 
  DebugCounter, DappMessagesDebug} from "../codegen/index.sol";
import { ICartesiDApp, Proof } from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";
import "@cartesi/rollups/contracts/inputs/IInputBox.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DappSystem is System {
  using WorldResourceIdInstance for ResourceId;
  error DappSystem__InvalidOwner();
  error DappSystem__InvalidResource();
  error DappSystem__ArrayError();
  error DappSystem__InvalidPayload();

  function addInput(address _dapp, bytes calldata _payload) public returns (bytes32) {
    if (_payload.length < 4) revert DappSystem__InvalidPayload();

    // get namespace system from db by dapp address
    bytes32 dappResourceIdbytes = DappAddressNamespace.get(_dapp);
    if (dappResourceIdbytes == 0x0) revert DappSystem__InvalidResource();

    ResourceId dappSystemResourceId = ResourceId.wrap(dappResourceIdbytes);

    bytes32[] memory subscriptions = NamespaceSubscriptions.get(dappResourceIdbytes);

    SystemCallData[] memory systemPrepareInputCalls = new SystemCallData[](subscriptions.length + 1);
    
    // // DEBUG
    // uint32 c = DebugCounter.get();

    // DappMessagesDebug.set(c++, "dappResourceIdbytes ",abi.encodePacked(dappResourceIdbytes));
    // DappMessagesDebug.set(c++, "subs size ",abi.encodePacked(subscriptions.length));

    for (uint32 i = 0; i < subscriptions.length; i++) {
      systemPrepareInputCalls[i].systemId = ResourceId.wrap(subscriptions[i]);
      systemPrepareInputCalls[i].callData = abi.encodeWithSignature("prepareInput(bytes)", _payload);
      // DappMessagesDebug.set(c++, "prepare sub ",systemPrepareInputCalls[i].callData);
    }

    systemPrepareInputCalls[subscriptions.length].systemId = dappSystemResourceId;
    systemPrepareInputCalls[subscriptions.length].callData = abi.encodeWithSignature("prepareInput(bytes)", _payload);
    // DappMessagesDebug.set(c++, "prepare me",systemPrepareInputCalls[subscriptions.length].callData);

    bytes[] memory returnData = IWorld(_world()).batchCall(systemPrepareInputCalls);

    ResourceId coreDappSystem = WorldResourceIdLib.encode(RESOURCE_SYSTEM, "core", "DappSystem");

    // // add msg sender bytes in between
    bytes memory _proxiedPayload = abi.encodePacked(_payload[:4],_msgSender(),_payload[4:]);

    SystemCallData[] memory inputBoxCalls = new SystemCallData[](subscriptions.length + 1);
    for (uint i = 0; i < subscriptions.length; i++) {
      (bool performAddInput) = abi.decode(returnData[i],(bool));
      if (performAddInput) {
        inputBoxCalls[i].systemId = coreDappSystem;
        inputBoxCalls[i].callData = abi.encodeWithSignature("addInputToCartesiInputBox(bytes32,bytes)", subscriptions[i], _proxiedPayload);
        // DappMessagesDebug.set(c++, "send input ", inputBoxCalls[i].callData);
      }
    }
    inputBoxCalls[subscriptions.length].systemId = coreDappSystem;
    inputBoxCalls[subscriptions.length].callData = abi.encodeWithSignature("addInputToCartesiInputBox(bytes32,bytes)", dappSystemResourceId, _proxiedPayload);
    // DappMessagesDebug.set(c++, "send input me",inputBoxCalls[subscriptions.length].callData);

    // // DEBUG
    // uint32 c = DebugCounter.get();
    // address dapp;
    // DappMessagesDebug.set(c++, "", abi.encodePacked(coreDappSystem));
    // DappMessagesDebug.set(c++, "", inputBoxCalls[subscriptions.length].callData);
    // DebugCounter.set(c);

    returnData = IWorld(_world()).batchCall(inputBoxCalls);

    return bytes32(returnData[0]);
  }

  function addInputToCartesiInputBox(bytes32 resourceId, bytes calldata _payload) public returns (bytes32) {
    // add msg sender bytes in between
    address dapp = NamespaceDappAddress.get(resourceId);
    if (dapp == address(0)) revert DappSystem__InvalidResource();
    
    // debug to see event
    // TODO: change this to inputbox call
    uint32 c = DebugCounter.get();
    DappMessagesDebug.set(c++, "addInputToCartesiInputBox", abi.encode(dapp,_payload));
    DebugCounter.set(c);

    // return 0x0;
    return IWorld(_world()).core__proxyAddInput(dapp, _payload);
  }


  function setNamespaceSystem(address _dapp, ResourceId systemResource) public {

    // // TODO: uncomment this check
    // // check namespace owner
    // AccessControl.requireOwner(systemResource, _msgSender());

    // // TODO: uncomment this check
    // // // check dapp owner
    // // Ownable c = Ownable(_dapp);
    // // if (c.owner() != _msgSender()) revert DappSystem__InvalidOwner();

    // // TODO: check system has prepare input function
    // // TODO: check dapp is dapp

    DappAddressNamespace.set(_dapp, bytes32(abi.encodePacked(systemResource)));
    NamespaceDappAddress.set(bytes32(abi.encodePacked(systemResource)),_dapp);
  }

  function addSystemSubscription(ResourceId systemResource, ResourceId systemToSubscribe) external {

    // // TODO: uncomment this check
    // // check namespace owner
    // AccessControl.requireOwner(systemResource, _msgSender());

    bytes32 subscribedSystem = ResourceId.unwrap(systemResource);
    bytes32 mainSystem = ResourceId.unwrap(systemToSubscribe);

    // check if systens exist
    if (NamespaceDappAddress.get(subscribedSystem) == address(0)) revert DappSystem__InvalidResource();
    if (NamespaceDappAddress.get(mainSystem) == address(0)) revert DappSystem__InvalidResource();

    bytes32[] memory subscriptions = NamespaceSubscriptions.get(mainSystem);

    uint l = subscriptions.length;

    bytes32[] memory newSubscriptions = new bytes32[](l+1);

    // check if is already 
    for (uint i=0; i<l; i++) {
      if (subscriptions[i] == subscribedSystem) revert DappSystem__ArrayError();
      newSubscriptions[i] = subscriptions[i];
    }
    
    newSubscriptions[l] = subscribedSystem;

    NamespaceSubscriptions.set(mainSystem, newSubscriptions);

    bytes32[] memory dependencies = NamespaceDependencies.get(subscribedSystem);

    l = dependencies.length;
    bytes32[] memory newDependencies = new bytes32[](l+1);

    // check if is already 
    for (uint i=0; i<l; i++) {
      if (dependencies[i] == mainSystem) revert DappSystem__ArrayError();
      newDependencies[i] = dependencies[i];
    }
    
    newDependencies[l] = mainSystem;

    NamespaceDependencies.set(subscribedSystem,newDependencies);
  }

  function removeSystemSubscription(ResourceId systemResource, ResourceId systemToSubscribe) external {

    // // TODO: uncomment this check
    // // check namespace owner
    // if (NamespaceOwner._get(systemResource.getNamespaceId()) != _msgSender() || NamespaceOwner._get(systemToSubscribe.getNamespaceId()) != _msgSender())
    //   revert DappSystem__InvalidOwner();

    bytes32 subscribedSystem = bytes32(abi.encodePacked(systemResource));
    bytes32 mainSystem = bytes32(abi.encodePacked(systemToSubscribe));

    // check if systens exist
    if (NamespaceDappAddress.get(subscribedSystem) == address(0)) revert DappSystem__InvalidResource();
    if (NamespaceDappAddress.get(mainSystem) == address(0)) revert DappSystem__InvalidResource();

    bytes32[] memory subscriptions = NamespaceSubscriptions.get(mainSystem);
    if (subscriptions.length == 0) revert DappSystem__ArrayError(); // empty array

    uint l = subscriptions.length;

    bytes32[] memory newSubscriptions = new bytes32[](l-1);

    // check if is already 
    for (uint i=0; i<l; i++) {
      if (subscriptions[i] == subscribedSystem) continue;
      if (i == l-1) revert DappSystem__ArrayError(); // not in array
      newSubscriptions[i] = subscriptions[i];
    }

    NamespaceSubscriptions.set(mainSystem, newSubscriptions);

    bytes32[] memory dependencies = NamespaceDependencies.get(subscribedSystem);

    l = dependencies.length;
    bytes32[] memory newDependencies = new bytes32[](l-1);

    // check if is already 
    for (uint i=0; i<l; i++) {
      if (dependencies[i] == mainSystem) continue;
      if (i == l-1) revert DappSystem__ArrayError(); // not in array
      newDependencies[i] = dependencies[i];
    }
    
    NamespaceDependencies.set(subscribedSystem,newDependencies);
  }

  function validateNotice(
    ResourceId system,
    bytes calldata _payload,
    uint32[] calldata _payloadSliceIndex,
    Proof[] calldata _proofs) external view returns (bool) 
  {
    bytes32 systemResourceId = bytes32(abi.encodePacked(system));
    bytes32[] memory dependencies = NamespaceDependencies.get(systemResourceId);

    if (_payloadSliceIndex.length != dependencies.length) revert DappSystem__ArrayError();
    if (_proofs.length != _payloadSliceIndex.length -1) revert DappSystem__ArrayError();

    address dapp;

    for (uint i=0; i<dependencies.length; i++) {

      dapp = NamespaceDappAddress.get(dependencies[i]);

      if (!ICartesiDApp(dapp).validateNotice(_payload[_payloadSliceIndex[i]:],_proofs[i])) return false;
    }
    
    dapp = NamespaceDappAddress.get(systemResourceId);
    return ICartesiDApp(dapp).validateNotice(_payload,_proofs[dependencies.length]);
  }

}
