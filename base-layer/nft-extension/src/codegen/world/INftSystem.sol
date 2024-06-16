// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

import { Proof } from "@cartesi/rollups/contracts/dapp/ICartesiDApp.sol";

/**
 * @title INftSystem
 * @author MUD (https://mud.dev) by Lattice (https://lattice.xyz)
 * @dev This interface is automatically generated from the corresponding system contract. Do not edit manually.
 */
interface INftSystem {
  function tapeNft__prepareInput(bytes calldata) external pure returns (bool);

  function tapeNft__setDappAddress(address _dapp) external;

  function tapeNft__validateNotice(
    bytes calldata _payload,
    uint32[] calldata _payloadSliceIndex,
    Proof[] calldata _proofs
  ) external view returns (bool);
}