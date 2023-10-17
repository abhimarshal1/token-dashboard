import { publicClient } from "@/config/client";
import { TOKEN_CONFIG } from "@/constants/contract";
import { getLogsWithBlockTimestamp } from "@/utils/block";
import { getTokenHoldersAndMinters } from "@/utils/token";
import { parseAbiItem } from "viem";

export async function GET() {
  const blockNumber = await publicClient.getBlockNumber();
  const logs = await publicClient.getLogs({
    address: TOKEN_CONFIG.address,
    event: parseAbiItem(
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    ),
    fromBlock: blockNumber - 269000n,
    toBlock: blockNumber,
    strict: true,
  });

  const [{ holders, minters }, logsWithBlockTimestamp] = await Promise.all([
    getTokenHoldersAndMinters(logs),
    getLogsWithBlockTimestamp(logs),
  ]);

  const response = JSON.stringify(
    { logs: logsWithBlockTimestamp, holders, minters },
    (_, value) => (typeof value === "bigint" ? value.toString() : value)
  );

  return new Response(response);
}
