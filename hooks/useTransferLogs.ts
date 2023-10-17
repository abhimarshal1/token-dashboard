import { useEffect, useRef, useState } from "react";
import { INITIAL_DATA } from "@/constants/context";
import { AppContextType } from "@/types/common";

const useTransferLogs = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<AppContextType>(INITIAL_DATA);
  const optimizerRef = useRef(false);

  useEffect(() => {
    if (!optimizerRef.current) {
      optimizerRef.current = true;
      (async function fetchData() {
        try {
          const data = await fetch("/api/tokenHistory");
          const json = await data.json();

          setData(json);
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
