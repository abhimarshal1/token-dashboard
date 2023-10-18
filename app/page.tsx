"use client";
import { TOKEN_CONFIG } from "@/constants/contract";
import styles from "./page.module.css";
import useApp from "@/hooks/useApp";
import { formatTokenValueInCurrency, shortenHash } from "@/utils/common";
import { useMemo, useState } from "react";
import { zeroAddress } from "viem";
import { explorerUrl } from "@/config/client";

const itemsPerPage = 10;

export default function Home() {
  const { logs } = useApp();
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState("desc");

  const flattenedArgsLogs = useMemo(
    () => logs.map((log) => ({ ...log, ...log.args })),
    [logs]
  );

  const filteredLogs = useMemo(
    () =>
      filterValue
        ? flattenedArgsLogs.filter((item) => {
            const values = [
              item.transactionHash?.toLowerCase(),
              item.from?.toLowerCase(),
              item.to?.toLowerCase(),
            ];
            const fValue = filterValue.toLowerCase();

            return values.includes(fValue);
          })
        : flattenedArgsLogs,
    [filterValue, flattenedArgsLogs]
  );

  const sortedFilteredLogs = useMemo(
    () =>
      filteredLogs.sort((a, b) => {
        const isAscending = sortDirection === "asc";
        const value1 = +(isAscending ? a : b).timestamp;
        const value2 = +(isAscending ? b : a).timestamp;

        return Number(value1 - value2);
      }),
    [filteredLogs, sortDirection]
  );

  const sortIcon = useMemo(
    () => (sortDirection === "asc" ? "🔼" : "🔽"),
    [sortDirection]
  );

  const indexOfLastItem = useMemo(
    () => currentPage * itemsPerPage,
    [currentPage]
  );
  const indexOfFirstItem = useMemo(
    () => indexOfLastItem - itemsPerPage,
    [indexOfLastItem]
  );
  const currentItems = useMemo(
    () => sortedFilteredLogs.slice(indexOfFirstItem, indexOfLastItem),
    [sortedFilteredLogs, indexOfFirstItem, indexOfLastItem]
  );

  return (
    <main className={styles.main}>
      <div className={styles.tableContainer}>
        <div>
          <input
            className={styles.filterInput}
            type="text"
            placeholder="Filter by address"
            onChange={(e) => setFilterValue(e.target.value)}
            value={filterValue}
          />
        </div>
        <table className={styles.table} data-cy="transaction-table">
          <thead>
            <tr>
              <th>Txn Hash</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Value ({TOKEN_CONFIG.symbol})</th>
              <th>Block Number</th>
              <th
                className={styles.sortColumn}
                onClick={() =>
                  setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                Timestamp {sortIcon}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => {
              const isMintTxn = item.from!.toString() === zeroAddress;

              return (
                <tr key={`${item.blockHash}${item.from}${item.logIndex}`}>
                  <td>
                    <a
                      href={`${explorerUrl}/tx/${item.transactionHash}`}
                      target="_blank"
                    >
                      {shortenHash(item.transactionHash!)}
                    </a>
                  </td>
                  <td> {isMintTxn ? "Mint" : "Transfer"}</td>
                  <td>
                    {isMintTxn ? (
                      "-"
                    ) : (
                      <a
                        href={`${explorerUrl}/address/${item.from}`}
                        target="_blank"
                      >
                        {shortenHash(item.from!)}
                      </a>
                    )}
                  </td>
                  <td>
                    <a
                      href={`${explorerUrl}/address/${item.to}`}
                      target="_blank"
                    >
                      {shortenHash(item.to!)}
                    </a>
                  </td>
                  <td>{formatTokenValueInCurrency(item.value!)}</td>
                  <td>
                    <a
                      href={`${explorerUrl}/block/${item.blockNumber}`}
                      target="_blank"
                    >
                      {item.blockNumber!.toString()}
                    </a>
                  </td>
                  <td>{new Date(+item.timestamp).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <div>
            <button
              className={styles.button}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className={styles.button}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={indexOfLastItem >= sortedFilteredLogs.length}
            >
              Next
            </button>
          </div>
          <p>
            Showing {indexOfFirstItem + 1} - {indexOfLastItem} of{" "}
            {sortedFilteredLogs.length} records
          </p>
        </div>
      </div>
    </main>
  );
}
