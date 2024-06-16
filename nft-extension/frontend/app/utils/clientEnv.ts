import { str, envsafe, url, json } from 'envsafe';


export const envClient = envsafe({
  DAPP_ADDR: str({
    input: process.env.NEXT_PUBLIC_DAPP_ADDR,
    desc: "Cartesi DApp ETH address."
  }),
  CARTESI_NODE_URL: url({
    input: process.env.NEXT_PUBLIC_CARTESI_NODE_URL,
    desc: "Cartesi Node URL."
  }),
  CARTESI_NODE_EXTENSION_URL: url({
    input: process.env.NEXT_PUBLIC_CARTESI_NODE_EXTENSION_URL,
    desc: "Cartesi Node extension URL."
  }),
  NETWORK_CHAIN_ID: str({
    input: process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID,
    desc: "Network ChainId (in hex) where the Cartesi DApp was deployed."
  }),
  GIF_SERVER_URL: url({
    input: process.env.NEXT_PUBLIC_GIF_SERVER_URL,
    desc: "GIF Server URL."
  }),
  CONTESTS: json({
    input: process.env.NEXT_PUBLIC_CONTESTS,
    desc: "Contests json list."
  }),
  WORLD_ADDRESS: str({
    input: process.env.NEXT_PUBLIC_WORLD_ADDRESS,
    desc: "Mud world ETH address."
  }),
})