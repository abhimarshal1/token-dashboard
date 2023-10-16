import { useEffect, useRef, useState } from "react";
import { BlockNumber } from "viem";
import { INITIAL_DATA } from "@/constants/context";
import { AppContextType, BlockTimestampMapping } from "@/types/common";
import { publicClient } from "@/utils/client";
import { parseAbiItem } from "viem/abi";
import { getTokenHoldersAndMinters } from "@/utils/token";
import { TOKEN_CONFIG } from "@/constants/contract";
import { getBlocksWithRateLimit } from "@/utils/rateLimit";

const useTransferLogs = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<AppContextType>(INITIAL_DATA);
  const [blockTimestampData, setBlockTimestampData] =
    useState<BlockTimestampMapping>({});
  const optimizerRef = useRef(false);

  useEffect(() => {
    if (!optimizerRef.current) {
      optimizerRef.current = true;

      const fetchTransferEventLogs = async () => {
        try {
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

          logs.sort((a, b) => Number(b.blockNumber - a.blockNumber));

          const { holders, minters } = await getTokenHoldersAndMinters(logs);

          setData({ logs, holders, minters });
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
          optimizerRef.current = false;
        }
      };

      fetchTransferEventLogs();
    }
  }, []);

  useEffect(() => {
    if (data.logs.length) {
      const blockNumberSet = new Set<BlockNumber>();

      data.logs.forEach(
        (log) => log.blockNumber && blockNumberSet.add(log.blockNumber)
      );

      const fetchTransactionTimestamp = async () => {
        const data = await getBlocksWithRateLimit(
          Array.from(blockNumberSet),
          220
        );

        setBlockTimestampData(data);
      };

      fetchTransactionTimestamp();
    }
  }, [data.logs]);

  return { loading: isLoading, data, blockTimestampData };
};

export default useTransferLogs;
