"use client";

import { motion } from "framer-motion";
import { Empty, Skeleton } from "./ui";

export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends { id: number | string }>({
  columns,
  rows,
  loading,
  empty = "Nothing to show yet",
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  empty?: string;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    );
  }

  if (!rows.length) return <Empty message={empty} />;

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-line)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr
            className="text-sm font-semibold text-white"
            style={{
              background:
                "linear-gradient(180deg, var(--color-green-soft), var(--color-green))",
            }}
          >
            {columns.map((c, i) => (
              <th key={i} className={`px-4 py-3.5 ${c.className ?? ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: ri * 0.03 }}
              className="border-t border-[var(--color-line)] bg-white text-[15px] transition-colors hover:bg-[var(--color-bg)]"
            >
              {columns.map((c, ci) => (
                <td key={ci} className={`px-4 py-3.5 ${c.className ?? ""}`}>
                  {c.cell(row)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
