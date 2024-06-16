import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "tapeNft",
  tables: {
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
