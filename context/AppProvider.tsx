import { PropsWithChildren, createContext } from "react";

import useTransferLogs from "@/hooks/useTransferLogs";
import { INITIAL_DATA } from "@/constants/context";

export const AppContext = createContext(INITIAL_DATA);

const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  const { loading, data, blockTimestampData } = useTransferLogs();

  if (loading) {
    return (
      <div className="spinnerContainer">
        <div className="spinner" />
        <p>Loading Logs</p>
      </div>
    );
  }

  if (!Object.keys(blockTimestampData).length) {
    return (
      <div className="spinnerContainer">
        <div className="spinner" />
        <p>Loading Block Data</p>
      </div>
    );
  }

  console.log('data', data)
  console.log("blockTimestampData", blockTimestampData);

  return (
    <AppContext.Provider value={{ ...data, blockTimestampData }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
