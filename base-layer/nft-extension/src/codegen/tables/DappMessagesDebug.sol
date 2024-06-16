// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

/* Autogenerated file. Do not edit manually. */

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { FieldLayout } from "@latticexyz/store/src/FieldLayout.sol";
import { Schema } from "@latticexyz/store/src/Schema.sol";
import { EncodedLengths, EncodedLengthsLib } from "@latticexyz/store/src/EncodedLengths.sol";
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";

struct DappMessagesDebugData {
  string message;
  bytes data;
}

library DappMessagesDebug {
  // Hex below is the result of `WorldResourceIdLib.encode({ namespace: "tapeNft", name: "DappMessagesDebu", typeId: RESOURCE_TABLE });`
  ResourceId constant _tableId = ResourceId.wrap(0x7462746170654e667400000000000000446170704d6573736167657344656275);

  FieldLayout constant _fieldLayout =
    FieldLayout.wrap(0x0000000200000000000000000000000000000000000000000000000000000000);

  // Hex-encoded key schema of (uint32)
  Schema constant _keySchema = Schema.wrap(0x0004010003000000000000000000000000000000000000000000000000000000);
  // Hex-encoded value schema of (string, bytes)
  Schema constant _valueSchema = Schema.wrap(0x00000002c5c40000000000000000000000000000000000000000000000000000);

  /**
   * @notice Get the table's key field names.
   * @return keyNames An array of strings with the names of key fields.
   */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](1);
    keyNames[0] = "index";
  }

  /**
   * @notice Get the table's value field names.
   * @return fieldNames An array of strings with the names of value fields.
   */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](2);
    fieldNames[0] = "message";
    fieldNames[1] = "data";
  }

  /**
   * @notice Register the table with its config.
   */
  function register() internal {
    StoreSwitch.registerTable(_tableId, _fieldLayout, _keySchema, _valueSchema, getKeyNames(), getFieldNames());
  }

  /**
   * @notice Register the table with its config.
   */
  function _register() internal {
    StoreCore.registerTable(_tableId, _fieldLayout, _keySchema, _valueSchema, getKeyNames(), getFieldNames());
  }

  /**
   * @notice Get message.
   */
  function getMessage(uint32 index) internal view returns (string memory message) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    bytes memory _blob = StoreSwitch.getDynamicField(_tableId, _keyTuple, 0);
    return (string(_blob));
  }

  /**
   * @notice Get message.
   */
  function _getMessage(uint32 index) internal view returns (string memory message) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    bytes memory _blob = StoreCore.getDynamicField(_tableId, _keyTuple, 0);
    return (string(_blob));
  }

  /**
   * @notice Set message.
   */
  function setMessage(uint32 index, string memory message) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreSwitch.setDynamicField(_tableId, _keyTuple, 0, bytes((message)));
  }

  /**
   * @notice Set message.
   */
  function _setMessage(uint32 index, string memory message) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreCore.setDynamicField(_tableId, _keyTuple, 0, bytes((message)));
  }

  /**
   * @notice Get the length of message.
   */
  function lengthMessage(uint32 index) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    uint256 _byteLength = StoreSwitch.getDynamicFieldLength(_tableId, _keyTuple, 0);
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * @notice Get the length of message.
   */
  function _lengthMessage(uint32 index) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    uint256 _byteLength = StoreCore.getDynamicFieldLength(_tableId, _keyTuple, 0);
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * @notice Get an item of message.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function getItemMessage(uint32 index, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    unchecked {
      bytes memory _blob = StoreSwitch.getDynamicFieldSlice(_tableId, _keyTuple, 0, _index * 1, (_index + 1) * 1);
      return (string(_blob));
    }
  }

  /**
   * @notice Get an item of message.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function _getItemMessage(uint32 index, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    unchecked {
      bytes memory _blob = StoreCore.getDynamicFieldSlice(_tableId, _keyTuple, 0, _index * 1, (_index + 1) * 1);
      return (string(_blob));
    }
  }

  /**
   * @notice Push a slice to message.
   */
  function pushMessage(uint32 index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreSwitch.pushToDynamicField(_tableId, _keyTuple, 0, bytes((_slice)));
  }

  /**
   * @notice Push a slice to message.
   */
  function _pushMessage(uint32 index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreCore.pushToDynamicField(_tableId, _keyTuple, 0, bytes((_slice)));
  }

  /**
   * @notice Pop a slice from message.
   */
  function popMessage(uint32 index) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreSwitch.popFromDynamicField(_tableId, _keyTuple, 0, 1);
  }

  /**
   * @notice Pop a slice from message.
   */
  function _popMessage(uint32 index) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreCore.popFromDynamicField(_tableId, _keyTuple, 0, 1);
  }

  /**
   * @notice Update a slice of message at `_index`.
   */
  function updateMessage(uint32 index, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    unchecked {
      bytes memory _encoded = bytes((_slice));
      StoreSwitch.spliceDynamicData(_tableId, _keyTuple, 0, uint40(_index * 1), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Update a slice of message at `_index`.
   */
  function _updateMessage(uint32 index, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    unchecked {
      bytes memory _encoded = bytes((_slice));
      StoreCore.spliceDynamicData(_tableId, _keyTuple, 0, uint40(_index * 1), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Get data.
   */
  function getData(uint32 index) internal view returns (bytes memory data) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    bytes memory _blob = StoreSwitch.getDynamicField(_tableId, _keyTuple, 1);
    return (bytes(_blob));
  }

  /**
   * @notice Get data.
   */
  function _getData(uint32 index) internal view returns (bytes memory data) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    bytes memory _blob = StoreCore.getDynamicField(_tableId, _keyTuple, 1);
    return (bytes(_blob));
  }

  /**
   * @notice Set data.
   */
  function setData(uint32 index, bytes memory data) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreSwitch.setDynamicField(_tableId, _keyTuple, 1, bytes((data)));
  }

  /**
   * @notice Set data.
   */
  function _setData(uint32 index, bytes memory data) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreCore.setDynamicField(_tableId, _keyTuple, 1, bytes((data)));
  }

  /**
   * @notice Get the length of data.
   */
  function lengthData(uint32 index) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    uint256 _byteLength = StoreSwitch.getDynamicFieldLength(_tableId, _keyTuple, 1);
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * @notice Get the length of data.
   */
  function _lengthData(uint32 index) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    uint256 _byteLength = StoreCore.getDynamicFieldLength(_tableId, _keyTuple, 1);
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * @notice Get an item of data.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function getItemData(uint32 index, uint256 _index) internal view returns (bytes memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    unchecked {
      bytes memory _blob = StoreSwitch.getDynamicFieldSlice(_tableId, _keyTuple, 1, _index * 1, (_index + 1) * 1);
      return (bytes(_blob));
    }
  }

  /**
   * @notice Get an item of data.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function _getItemData(uint32 index, uint256 _index) internal view returns (bytes memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    unchecked {
      bytes memory _blob = StoreCore.getDynamicFieldSlice(_tableId, _keyTuple, 1, _index * 1, (_index + 1) * 1);
      return (bytes(_blob));
    }
  }

  /**
   * @notice Push a slice to data.
   */
  function pushData(uint32 index, bytes memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreSwitch.pushToDynamicField(_tableId, _keyTuple, 1, bytes((_slice)));
  }

  /**
   * @notice Push a slice to data.
   */
  function _pushData(uint32 index, bytes memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreCore.pushToDynamicField(_tableId, _keyTuple, 1, bytes((_slice)));
  }

  /**
   * @notice Pop a slice from data.
   */
  function popData(uint32 index) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreSwitch.popFromDynamicField(_tableId, _keyTuple, 1, 1);
  }

  /**
   * @notice Pop a slice from data.
   */
  function _popData(uint32 index) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreCore.popFromDynamicField(_tableId, _keyTuple, 1, 1);
  }

  /**
   * @notice Update a slice of data at `_index`.
   */
  function updateData(uint32 index, uint256 _index, bytes memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    unchecked {
      bytes memory _encoded = bytes((_slice));
      StoreSwitch.spliceDynamicData(_tableId, _keyTuple, 1, uint40(_index * 1), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Update a slice of data at `_index`.
   */
  function _updateData(uint32 index, uint256 _index, bytes memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    unchecked {
      bytes memory _encoded = bytes((_slice));
      StoreCore.spliceDynamicData(_tableId, _keyTuple, 1, uint40(_index * 1), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Get the full data.
   */
  function get(uint32 index) internal view returns (DappMessagesDebugData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    (bytes memory _staticData, EncodedLengths _encodedLengths, bytes memory _dynamicData) = StoreSwitch.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Get the full data.
   */
  function _get(uint32 index) internal view returns (DappMessagesDebugData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    (bytes memory _staticData, EncodedLengths _encodedLengths, bytes memory _dynamicData) = StoreCore.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function set(uint32 index, string memory message, bytes memory data) internal {
    bytes memory _staticData;
    EncodedLengths _encodedLengths = encodeLengths(message, data);
    bytes memory _dynamicData = encodeDynamic(message, data);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function _set(uint32 index, string memory message, bytes memory data) internal {
    bytes memory _staticData;
    EncodedLengths _encodedLengths = encodeLengths(message, data);
    bytes memory _dynamicData = encodeDynamic(message, data);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function set(uint32 index, DappMessagesDebugData memory _table) internal {
    bytes memory _staticData;
    EncodedLengths _encodedLengths = encodeLengths(_table.message, _table.data);
    bytes memory _dynamicData = encodeDynamic(_table.message, _table.data);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function _set(uint32 index, DappMessagesDebugData memory _table) internal {
    bytes memory _staticData;
    EncodedLengths _encodedLengths = encodeLengths(_table.message, _table.data);
    bytes memory _dynamicData = encodeDynamic(_table.message, _table.data);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Decode the tightly packed blob of dynamic data using the encoded lengths.
   */
  function decodeDynamic(
    EncodedLengths _encodedLengths,
    bytes memory _blob
  ) internal pure returns (string memory message, bytes memory data) {
    uint256 _start;
    uint256 _end;
    unchecked {
      _end = _encodedLengths.atIndex(0);
    }
    message = (string(SliceLib.getSubslice(_blob, _start, _end).toBytes()));

    _start = _end;
    unchecked {
      _end += _encodedLengths.atIndex(1);
    }
    data = (bytes(SliceLib.getSubslice(_blob, _start, _end).toBytes()));
  }

  /**
   * @notice Decode the tightly packed blobs using this table's field layout.
   *
   * @param _encodedLengths Encoded lengths of dynamic fields.
   * @param _dynamicData Tightly packed dynamic fields.
   */
  function decode(
    bytes memory,
    EncodedLengths _encodedLengths,
    bytes memory _dynamicData
  ) internal pure returns (DappMessagesDebugData memory _table) {
    (_table.message, _table.data) = decodeDynamic(_encodedLengths, _dynamicData);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function deleteRecord(uint32 index) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function _deleteRecord(uint32 index) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    StoreCore.deleteRecord(_tableId, _keyTuple, _fieldLayout);
  }

  /**
   * @notice Tightly pack dynamic data lengths using this table's schema.
   * @return _encodedLengths The lengths of the dynamic fields (packed into a single bytes32 value).
   */
  function encodeLengths(
    string memory message,
    bytes memory data
  ) internal pure returns (EncodedLengths _encodedLengths) {
    // Lengths are effectively checked during copy by 2**40 bytes exceeding gas limits
    unchecked {
      _encodedLengths = EncodedLengthsLib.pack(bytes(message).length, bytes(data).length);
    }
  }

  /**
   * @notice Tightly pack dynamic (variable length) data using this table's schema.
   * @return The dynamic data, encoded into a sequence of bytes.
   */
  function encodeDynamic(string memory message, bytes memory data) internal pure returns (bytes memory) {
    return abi.encodePacked(bytes((message)), bytes((data)));
  }

  /**
   * @notice Encode all of a record's fields.
   * @return The static (fixed length) data, encoded into a sequence of bytes.
   * @return The lengths of the dynamic fields (packed into a single bytes32 value).
   * @return The dynamic (variable length) data, encoded into a sequence of bytes.
   */
  function encode(
    string memory message,
    bytes memory data
  ) internal pure returns (bytes memory, EncodedLengths, bytes memory) {
    bytes memory _staticData;
    EncodedLengths _encodedLengths = encodeLengths(message, data);
    bytes memory _dynamicData = encodeDynamic(message, data);

    return (_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Encode keys as a bytes32 array using this table's field layout.
   */
  function encodeKeyTuple(uint32 index) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(index));

    return _keyTuple;
  }
}
