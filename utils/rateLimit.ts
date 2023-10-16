import { Block, BlockNumber } from "viem";
import { publicClient } from "./client";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getBlocksWithRateLimit = async (
  blockNumbers: BlockNumber[],
  batchSize: number
) => {
  const rateLimitMs = 1000;
  const results = [];

  for (let i = 0; i < blockNumbers.length; i += batchSize) {
    const batchPromises: Promise<Block>[] = [];

    for (let j = i; j < Math.min(i + batchSize, blockNumbers.length); j++) {
      batchPromises.push(
        publicClient.getBlock({ blockNumber: blockNumbers[j] })
      );
    }

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    if (i + batchSize < blockNumbers.length) {
      await delay(rateLimitMs);
    }
  }

  return results.reduce(
    (acc, curr) => ({ ...acc, [curr.number?.toString() || ""]: { ...curr } }),
    {}
  );
};
