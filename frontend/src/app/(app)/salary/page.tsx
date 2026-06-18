"use client";

import { useState } from "react";
import { Download, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "@/lib/useApi";
import { SectionTitle, Skeleton, Empty } from "@/components/ui";
import { fmtMoney, monthName } from "@/lib/format";

interface Slip {
  id: number; month: number; year: number;
  basic: number; da: number; hra: number; other_allowance: number;
  pf: number; tax: number; other_deduction: number;
  gross: number; deductions: number; net: number;
}

function Row({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={strong ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-ink-soft)]"}>{label}</span>
      <span className={strong ? "text-lg font-bold text-[var(--color-ink)]" : "font-medium text-[var(--color-ink)]"}>{fmtMoney(value)}</span>
    </div>
  );
}

export default function SalaryPage() {
  const { data, loading } = useApi<Slip[]>("/api/salary/mine");
  const [openId, setOpenId] = useState<number | null>(null);

  if (loading)
    return <div><SectionTitle title="Salary Slip" /><Skeleton className="h-72" /></div>;

  return (
    <div>
      <SectionTitle title="Salary Slip" subtitle="View and download your monthly pay statements." />
      {!data?.length ? (
        <Empty message="No salary slips available" />
      ) : (
        <div className="space-y-3">
          {data.map((s, i) => {
            const open = openId === s.id;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(open ? null : s.id)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-lg font-bold text-[var(--color-green)]">
                      {monthName(s.month).slice(0, 3)}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[var(--color-ink)]">{monthName(s.month)} {s.year}</p>
                      <p className="text-sm text-[var(--color-ink-faint)]">Net pay {fmtMoney(s.net)}</p>
                    </div>
                  </div>
                  <ChevronRight size={22} className="text-[var(--color-ink-faint)] transition-transform" style={{ transform: open ? "rotate(90deg)" : "none" }} />
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 border-t border-[var(--color-line)] p-5 sm:grid-cols-2">
                        <div>
                          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--color-success)]">Earnings</p>
                          <Row label="Basic" value={s.basic} />
                          <Row label="Dearness Allowance" value={s.da} />
                          <Row label="House Rent Allowance" value={s.hra} />
                          <Row label="Other Allowance" value={s.other_allowance} />
                          <div className="mt-1 border-t border-[var(--color-line)] pt-1"><Row label="Gross" value={s.gross} strong /></div>
                        </div>
                        <div>
                          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--color-danger)]">Deductions</p>
                          <Row label="Provident Fund" value={s.pf} />
                          <Row label="Tax" value={s.tax} />
                          <Row label="Other" value={s.other_deduction} />
                          <div className="mt-1 border-t border-[var(--color-line)] pt-1"><Row label="Total Deductions" value={s.deductions} strong /></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-[var(--color-surface-2)] px-5 py-4">
                        <span className="text-lg font-bold text-[var(--color-green-deep)]">Net Pay</span>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-[var(--color-green-deep)]">{fmtMoney(s.net)}</span>
                          <button onClick={() => window.print()} className="btn btn-ghost !py-2 !px-4 text-sm">
                            <Download size={16} /> Print
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
