"use client";
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

  const { loading, data } = useTransferLogs();
  const [cachedData, setCachedData] = useLocalStorage(dataKey, {
    ...data,
  });

  useEffect(() => {
    if (data.logs.length) {
      setCachedData({ ...data });
    }
  }, [data, setCachedData]);

  const computedData = data.logs.length ? data : cachedData;

  if (loading && !computedData.logs.length) {
    return (
      <div className="spinnerContainer">
        <div className="spinner" />
        <p>Querying the network</p>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        ...computedData,
      }}
    >
      <div className="sidebar">
        <p className="brand">Token Dashboard</p>
        <ul className="menus">
          {navItems.map((nav) => (
            <li
              key={nav.key}
              className={`${nav.key}-nav menu ${
                isSelectedPath(nav.href) ? "active" : ""
              }`}
            >
              <Link href={nav.href}>{nav.label}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="page-container">{children}</div>
    </AppContext.Provider>
  );
};

export default AppProvider;
