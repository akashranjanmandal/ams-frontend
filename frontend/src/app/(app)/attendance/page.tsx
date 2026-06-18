"use client";

import { useState, useEffect } from "react";
import { LogIn, LogOut, Clock, Check } from "lucide-react";
import { motion } from "framer-motion";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { useToast } from "@/components/Toast";
import { SectionTitle, StatusBadge, Spinner, MotionCard } from "@/components/ui";
import { DataTable, Column } from "@/components/DataTable";
import { fmtDate, fmtTime } from "@/lib/format";

interface Att {
  id: number;
  work_date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  remark: string;
}

export default function AttendancePage() {
  const { data: today, reload: reloadToday } = useApi<Att | null>("/api/attendance/today");
  const { data: history, loading, reload } = useApi<Att[]>("/api/attendance/history");
  const { push } = useToast();
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  async function act(kind: "check-in" | "check-out") {
    setBusy(true);
    try {
      await api.post(`/api/attendance/${kind}`);
      push("success", kind === "check-in" ? "Checked in. Have a great day!" : "Checked out. See you tomorrow!");
      reloadToday();
      reload();
    } catch (err) {
      push("error", err instanceof ApiError ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  const checkedIn = !!today?.check_in;
  const checkedOut = !!today?.check_out;

  const columns: Column<Att>[] = [
    { header: "Date", cell: (r) => <span className="font-semibold">{fmtDate(r.work_date)}</span> },
    { header: "Check In", cell: (r) => fmtTime(r.check_in) },
    { header: "Check Out", cell: (r) => fmtTime(r.check_out) },
    { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <SectionTitle title="Attendance" subtitle="Mark your attendance and view your history." />

      <div className="mb-7 grid gap-5 md:grid-cols-[1.2fr_1fr]">
        <MotionCard className="flex flex-col items-center justify-center text-center">
          <Clock size={28} className="text-[var(--color-green)]" />
          <p className="mt-2 text-sm text-[var(--color-ink-faint)]">
            {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <motion.p
            key={now.getSeconds()}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="text-5xl font-bold tracking-tight text-[var(--color-green-deep)]"
          >
            {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </motion.p>
        </MotionCard>

        <MotionCard delay={0.08} className="flex flex-col justify-center gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-ink-soft)]">Today's status</span>
            <StatusBadge status={checkedOut ? "Present" : checkedIn ? "Working" : "Pending"} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-ink-faint)]">In: <b className="text-[var(--color-ink)]">{fmtTime(today?.check_in)}</b></span>
            <span className="text-[var(--color-ink-faint)]">Out: <b className="text-[var(--color-ink)]">{fmtTime(today?.check_out)}</b></span>
          </div>
          {!checkedIn ? (
            <button onClick={() => act("check-in")} className="btn btn-primary w-full" disabled={busy}>
              {busy ? <Spinner /> : <><LogIn size={18} /> Check In</>}
            </button>
          ) : !checkedOut ? (
            <button onClick={() => act("check-out")} className="btn btn-primary w-full" disabled={busy}>
              {busy ? <Spinner /> : <><LogOut size={18} /> Check Out</>}
            </button>
          ) : (
            <p className="flex items-center justify-center gap-2 bg-[var(--color-surface-2)] py-3 text-center font-medium text-[var(--color-success)]" style={{ borderRadius: "var(--radius-sm)" }}>
              <Check size={18} /> Attendance complete for today
            </p>
          )}
        </MotionCard>
      </div>

      <h3 className="mb-3 text-xl font-bold text-[var(--color-green-deep)]">Recent History</h3>
      <DataTable columns={columns} rows={history ?? []} loading={loading} empty="No attendance records yet" />
    </div>
  );
}
