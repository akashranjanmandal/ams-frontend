"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/Toast";
import { SectionTitle, Avatar, Empty, Skeleton, Spinner } from "@/components/ui";
import { fmtDate } from "@/lib/format";

type Row = Record<string, unknown> & { id: number; employee_name?: string };

interface TabDef {
  key: string;
  label: string;
  listUrl: string;       // GET pending
  decisionUrl: (id: number) => string;  // POST decision
  summary: (r: Row) => string;
  detail: (r: Row) => string;
  adminOnly?: boolean;
}

const TABS: TabDef[] = [
  {
    key: "accounts",
    label: "New Accounts",
    listUrl: "/api/admin/accounts/pending",
    decisionUrl: (id) => `/api/admin/accounts/${id}/decision`,
    summary: (r) => `${r.designation || "—"} · ${r.department || "—"}`,
    detail: (r) => `${r.email} · ${r.employee_code} · ${r.phone || ""}`,
    adminOnly: true,
  },
  {
    key: "edits",
    label: "Profile Edits",
    listUrl: "/api/admin/edit-requests/pending",
    decisionUrl: (id) => `/api/admin/edit-requests/${id}/decision`,
    summary: (r) => {
      const ch = (r.changes ?? {}) as Record<string, { old: string; new: string }>;
      const parts = Object.entries(ch).map(
        ([f, v]) => `${f.replace(/_/g, " ")}: ${v?.old || "—"} → ${v?.new ?? ""}`
      );
      return parts.length ? parts.join(", ") : "Profile change";
    },
    detail: (r) => `Requested ${fmtDate(r.applied_at as string)}`,
  },
  {
    key: "leave",
    label: "Leave",
    listUrl: "/api/leave/pending",
    decisionUrl: (id) => `/api/leave/${id}/decision`,
    summary: (r) => `${r.leave_type} · ${r.total_days} day(s)`,
    detail: (r) => `${fmtDate(r.from_date as string)} – ${fmtDate(r.to_date as string)} · ${(r.reason as string) || "No reason"}`,
  },
  {
    key: "noc",
    label: "NOC",
    listUrl: "/api/noc/pending",
    decisionUrl: (id) => `/api/noc/${id}/decision`,
    summary: (r) => `${r.purpose}`,
    detail: (r) => `${(r.country as string) || ""} ${fmtDate(r.from_date as string)}`,
  },
  {
    key: "vacation",
    label: "Vacation",
    listUrl: "/api/vacation/pending",
    decisionUrl: (id) => `/api/vacation/${id}/decision`,
    summary: (r) => `${r.total_days} day(s)`,
    detail: (r) => `${fmtDate(r.from_date as string)} – ${fmtDate(r.to_date as string)}`,
  },
  {
    key: "oos",
    label: "Out of Station",
    listUrl: "/api/out-of-station/pending",
    decisionUrl: (id) => `/api/out-of-station/${id}/decision`,
    summary: (r) => `${r.destination}`,
    detail: (r) => `${(r.purpose as string) || ""} · ${fmtDate(r.from_date as string)} – ${fmtDate(r.to_date as string)}`,
  },
  {
    key: "resignation",
    label: "Resignation",
    listUrl: "/api/resignation/pending",
    decisionUrl: (id) => `/api/resignation/${id}/decision`,
    summary: (r) => `${r.resignation_type}`,
    detail: (r) => `LWD ${fmtDate(r.last_working_date as string)} · ${(r.reason as string) || ""}`,
  },
  {
    key: "dacp",
    label: "DACP",
    listUrl: "/api/dacp/pending",
    decisionUrl: (id) => `/api/dacp/${id}/decision`,
    summary: (r) => `${r.current_grade} → ${r.proposed_grade}`,
    detail: (r) => `Due ${fmtDate(r.due_date as string)}`,
  },
];

export default function ApprovalsPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const tabs = TABS.filter((t) => !t.adminOnly || user?.role === "admin");
  const [active, setActive] = useState(tabs[0]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [actingId, setActingId] = useState<number | null>(null);

  const load = useCallback(async (tab: TabDef) => {
    setLoading(true);
    try {
      const data = await api.get<Row[]>(tab.listUrl);
      setRows(data);
      setCounts((c) => ({ ...c, [tab.key]: data.length }));
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(active); }, [active, load]);

  useEffect(() => {
    tabs.forEach(async (t) => {
      try {
        const d = await api.get<Row[]>(t.listUrl);
        setCounts((c) => ({ ...c, [t.key]: d.length }));
      } catch { /* ignore */ }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function decide(id: number, status: "approved" | "rejected") {
    setActingId(id);
    try {
      await api.post(active.decisionUrl(id), { status, remark: "", approver_remark: "" });
      push(status === "approved" ? "success" : "info", `${active.label} ${status}.`);
      setRows((r) => r.filter((x) => x.id !== id));
      setCounts((c) => ({ ...c, [active.key]: Math.max(0, (c[active.key] ?? 1) - 1) }));
    } catch (err) {
      push("error", err instanceof ApiError ? err.message : "Failed");
    } finally {
      setActingId(null);
    }
  }

  return (
    <div>
      <SectionTitle title="Approvals Center" subtitle="Review and act on pending requests." />

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t)}
            className="relative flex items-center gap-2 px-4 py-2.5 text-[15px] font-semibold transition-colors"
            style={{ color: active.key === t.key ? "#fff" : "var(--color-ink-soft)", borderRadius: "var(--radius-sm)" }}
          >
            {active.key === t.key && (
              <motion.span
                layoutId="approval-tab"
                className="absolute inset-0"
                style={{ background: "var(--color-green)", borderRadius: "var(--radius-sm)" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{t.label}</span>
            {counts[t.key] > 0 && (
              <span
                className="relative px-2 py-0.5 text-xs font-bold text-white"
                style={{
                  background: active.key === t.key ? "rgba(255,255,255,0.25)" : "var(--color-green)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : rows.length === 0 ? (
        <Empty message={`No pending ${active.label.toLowerCase()}`} />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {rows.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30, transition: { duration: 0.25 } }}
                className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
              >
                <Avatar name={(r.employee_name as string) || (r.full_name as string) || "?"} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold text-[var(--color-ink)]">{(r.employee_name as string) || (r.full_name as string)}</p>
                  <p className="font-medium text-[var(--color-green)]">{active.summary(r)}</p>
                  <p className="text-sm text-[var(--color-ink-faint)]">{active.detail(r)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => decide(r.id, "approved")}
                    disabled={actingId === r.id}
                    className="btn btn-primary !py-2.5 !px-5 text-sm"
                  >
                    {actingId === r.id ? <Spinner size={16} /> : <><Check size={17} /> Approve</>}
                  </button>
                  <button
                    onClick={() => decide(r.id, "rejected")}
                    disabled={actingId === r.id}
                    className="btn btn-danger !py-2.5 !px-5 text-sm"
                  >
                    <X size={17} /> Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
