import { useEffect, useRef, useState } from "react";
import { INITIAL_DATA } from "@/constants/context";
import { AppContextType } from "@/types/common";
import { publicClient } from "@/config/client";
import { TOKEN_CONFIG } from "@/constants/contract";
import { parseAbiItem } from "viem";
import { getTokenHoldersAndMinters } from "@/utils/token";
import { getLogsWithBlockTimestamp } from "@/utils/block";

const useTransferLogs = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<AppContextType>(INITIAL_DATA);
  const optimizerRef = useRef(false);

  // useEffect(() => {
  //   if (!optimizerRef.current) {
  //     optimizerRef.current = true;
  //     (async function fetchData() {
  //       try {
  //         const data = await fetch("/api/tokenHistory");
  //         const json = await data.json();

  //         setData(json);
  //       } catch (e) {
  //         console.error(e);
  //       } finally {
  //         setLoading(false);
  //         optimizerRef.current = false;
  //       }
  //     })();
  //   }
  // }, []);
  useEffect(() => {
    if (!optimizerRef.current) {
      optimizerRef.current = true;
      (async function fetchData() {
        try {
          const blockNumber = await publicClient.getBlockNumber();
          const logs = await publicClient.getLogs({
            address: TOKEN_CONFIG.address,
            event: parseAbiItem(
              "event Transfer(address indexed from, address indexed to, uint256 value)"
            ),
            fromBlock: blockNumber - 300000n,
            strict: true,
          });

          const [{ holders, minters }, logsWithBlockTimestamp] =
            await Promise.all([
              getTokenHoldersAndMinters(logs),
              getLogsWithBlockTimestamp(logs),
            ]);

          setData({ logs: logsWithBlockTimestamp, holders, minters });
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
          optimizerRef.current = false;
        }
      })();
    }
  }, []);

  return { loading: isLoading, data };
};

export default useTransferLogs;
