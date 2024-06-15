import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "core",
  tables: {
    InputBoxAddress: {
      schema: {
        value: "address",
      },
      key: [],
    },
    CoreDappAddress: {
      schema: {
        value: "address",
      },
      key: [],
    },
    DappAddressNamespace: {
      schema: {
        namespace: "bytes32", 
        dappAddress: "address",
      },
      key: ["dappAddress"],
    },
    NamespaceDappAddress: {
      schema: {
        namespace: "bytes32", 
        dappAddress: "address",
      },
      key: ["namespace"],
    },
    NamespaceSubscriptions: {
      schema: {
        namespace: "bytes32", 
        subscriptions: "bytes32[]",
      },
      key: ["namespace"],
    },
    NamespaceDependencies: {
      schema: {
        namespace: "bytes32", 
        subscriptions: "bytes32[]",
      },
      key: ["namespace"],
    },
    DappMessagesDebug: {
      schema: { 
        index: "uint32", 
        message: "string",
        data: "bytes",
      },
      key: ["index"],
    },
    DebugCounter: {
      schema: {
        value: "uint32",
      },
      key: [],
    },
  },
});