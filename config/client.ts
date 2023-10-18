import { createPublicClient, http } from "viem";
import { baseGoerli } from "viem/chains";

export const publicClient = createPublicClient({
  chain: baseGoerli,
  transport: http("https://1rpc.io/base-goerli"),
});

export const explorerUrl = publicClient.chain.blockExplorers.default.url;
