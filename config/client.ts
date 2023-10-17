import { createPublicClient, http } from "viem";
import { baseGoerli } from "viem/chains";

export const publicClient = createPublicClient({
  chain: baseGoerli,
  transport: http(),
});

export const explorerUrl = publicClient.chain.blockExplorers.default.url;
