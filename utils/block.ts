import { Block, BlockNumber } from "viem";
import { publicClient } from "../config/client";
import { BlockTimestampMapping, Logs } from "@/types/common";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const rateLimitMs = 1000;
const batchSize = 220;

export const getLogsWithBlockTimestamp = async (logs: Logs[]) => {
  const blockNumberSet = new Set<BlockNumber>();

  logs.forEach((log) => log.blockNumber && blockNumberSet.add(log.blockNumber));

  const blockNumbers = Array.from(blockNumberSet);

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

  const blockTimestampMap = results.reduce(
    (acc, curr) => ({ ...acc, [curr.number?.toString() || ""]: { ...curr } }),
    {} as BlockTimestampMapping
  );

  return logs.map((log) => ({
    ...log,
    timestamp: blockTimestampMap[log.blockNumber!.toString()].timestamp * 1000n,
  }));
};
