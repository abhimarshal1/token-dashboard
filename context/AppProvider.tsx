import { PropsWithChildren, createContext, useEffect } from "react";
import Link from "next/link";
import useTransferLogs from "@/hooks/useTransferLogs";
import { INITIAL_DATA } from "@/constants/context";
import { useLocalStorage } from "./useLocalStorage";
import { usePathname } from "next/navigation";
import { navItems } from "@/constants/sidebar";

export const AppContext = createContext(INITIAL_DATA);

const dataKey = "token-dashboard-cached-data-logs";

const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  const pathname = usePathname();

  const isSelectedPath = (route: string) => pathname === route;

  const { loading, data, blockTimestampData } = useTransferLogs();
  const [cachedData, setCachedData] = useLocalStorage(dataKey, {
    ...data,
    blockTimestampData,
  });

  const isBlockTimestampDataEmpty = !Object.keys(blockTimestampData).length;

  useEffect(() => {
    if (data.logs.length && !isBlockTimestampDataEmpty) {
      setCachedData({ ...data, blockTimestampData });
    }
  }, [blockTimestampData, data, isBlockTimestampDataEmpty, setCachedData]);

  const computedData = data.logs.length ? data : cachedData;
  const computedBlockTimestampData = isBlockTimestampDataEmpty
    ? cachedData.blockTimestampData
    : blockTimestampData;

  if (
    (loading && !computedData.logs.length) ||
    !Object.keys(computedBlockTimestampData).length
  ) {
    const message =
      loading && !computedData.logs.length
        ? "Querying the network"
        : "Almost done! Please hold on";
    return (
      <div className="spinnerContainer">
        <div className="spinner" />
        <p>{message}</p>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        ...computedData,
        blockTimestampData: computedBlockTimestampData,
      }}
    >
      <div className="sidebar">
        <p className="brand">Token Dashboard</p>
        <ul className="menus">
          {navItems.map((nav) => (
            <li
              key={nav.name}
              className={`menu ${isSelectedPath(nav.href) ? "selected" : ""}`}
            >
              <Link href={nav.href}>{nav.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="page-container">{children}</div>
    </AppContext.Provider>
  );
};

export default AppProvider;
