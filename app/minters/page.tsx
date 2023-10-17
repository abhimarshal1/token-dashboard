"use client";
import { TOKEN_CONFIG } from "@/constants/contract";
import styles from "./page.module.css";
import useApp from "@/hooks/useApp";
import { shortenHash } from "@/utils/common";
import { useState } from "react";
import { formatUnits, zeroAddress } from "viem";
import { explorerUrl } from "@/config/client";

const itemsPerPage = 10;

export default function Minters() {
  const { minters } = useApp();
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = minters.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <main className={styles.main}>
      <div className={styles.tableContainer}>
        <table className={styles.table} data-cy="minters-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Address</th>
              <th>Value ({TOKEN_CONFIG.symbol})</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              return (
                <tr key={item.address}>
                  <td> {indexOfFirstItem + index + 1}</td>
                  <td>
                    <a
                      href={`${explorerUrl}/address/${item.address}`}
                      target="_blank"
                    >
                      {shortenHash(item.address!)}
                    </a>
                  </td>
                  <td>{formatUnits(item.value!, 6)}</td>
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
              disabled={indexOfLastItem >= minters.length}
            >
              Next
            </button>
          </div>
          <p>
            Showing {indexOfFirstItem + 1} - {indexOfLastItem} of{" "}
            {minters.length} records
          </p>
        </div>
      </div>
    </main>
  );
}
