"use client";
import { TOKEN_CONFIG } from "@/constants/contract";
import styles from "./page.module.css";
import useApp from "@/hooks/useApp";
import { shortenHash } from "@/utils/common";
import { useState } from "react";
import { formatUnits, zeroAddress } from "viem";
import { explorerUrl } from "@/utils/client";

const itemsPerPage = 10;

export default function Home() {
  const { logs, blockTimestampData } = useApp();
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const flattenedArgsLogs = logs.map((log) => ({ ...log, ...log.args }));

  const filteredLogs = filterValue
    ? flattenedArgsLogs.filter((item) => {
        const values = [item.from?.toLowerCase(), item.to?.toLowerCase()];
        const fValue = filterValue.toLowerCase();

        return values.includes(fValue);
      })
    : flattenedArgsLogs;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

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
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Txn Hash</th>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Value ({TOKEN_CONFIG.symbol})</th>
              <th>Block Number</th>
              <th>Timestamp</th>
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
                  <td>{formatUnits(item.value!, 6)}</td>
                  <td>
                    <a
                      href={`${explorerUrl}/block/${item.blockNumber}`}
                      target="_blank"
                    >
                      {item.blockNumber!.toString()}
                    </a>
                  </td>
                  <td>
                    {new Date(
                      Number(
                        blockTimestampData[item.blockNumber!.toString()]
                          .timestamp * 1000n
                      )
                    ).toLocaleString()}
                  </td>
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
              disabled={indexOfLastItem >= filteredLogs.length}
            >
              Next
            </button>
          </div>
          <p>
            Showing {indexOfFirstItem + 1} - {indexOfLastItem} of{" "}
            {filteredLogs.length} records
          </p>
        </div>
      </div>
    </main>
  );
}
