"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { useToast } from "@/components/Toast";
import { SectionTitle, StatusBadge, Spinner } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { DataTable, Column } from "@/components/DataTable";
import { fmtDate } from "@/lib/format";

interface Leave {
  id: number;
  leave_type: string;
  from_date: string;
  to_date: string;
  total_days: number;
  reason: string;
  status: string;
}

const TYPES = ["Casual Leave", "Earned Leave", "Medical Leave", "Maternity Leave"];

export default function LeavePage() {
  const { data, loading, reload } = useApi<Leave[]>("/api/leave/mine");
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    leave_type: "Casual Leave",
    from_date: "",
    to_date: "",
    reason: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/api/leave", form);
      push("success", "Leave request submitted.");
      setOpen(false);
      setForm({ leave_type: "Casual Leave", from_date: "", to_date: "", reason: "" });
      reload();
    } catch (err) {
      push("error", err instanceof ApiError ? err.message : "Failed to apply");
    } finally {
      setBusy(false);
    }
  }

  async function cancel(id: number) {
    try {
      await api.post(`/api/leave/${id}/cancel`);
      push("info", "Leave request cancelled.");
      reload();
    } catch (err) {
      push("error", err instanceof ApiError ? err.message : "Failed");
    }
  }

  const columns: Column<Leave>[] = [
    { header: "Type", cell: (r) => <span className="font-semibold">{r.leave_type}</span> },
    { header: "From", cell: (r) => fmtDate(r.from_date) },
    { header: "To", cell: (r) => fmtDate(r.to_date) },
    { header: "Days", cell: (r) => <span className="font-semibold">{r.total_days}</span> },
    { header: "Reason", cell: (r) => <span className="text-[var(--color-ink-soft)]">{r.reason || "—"}</span> },
    { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    {
      header: "",
      cell: (r) =>
        r.status === "pending" ? (
          <button
            onClick={() => cancel(r.id)}
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-danger)] hover:underline"
          >
            <X size={15} /> Cancel
          </button>
        ) : null,
    },
  ];

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <SectionTitle title="Leave" subtitle="Apply for leave and track your requests." />
        <button onClick={() => setOpen(true)} className="btn btn-primary mb-6">
          <Plus size={18} /> Apply for Leave
        </button>
      </div>

      <DataTable columns={columns} rows={data ?? []} loading={loading} empty="No leave requests yet" />

      <Modal open={open} onClose={() => setOpen(false)} title="Apply for Leave">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Leave Type</label>
            <select
              className="input"
              value={form.leave_type}
              onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
            >
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">From</label>
              <input
                type="date"
                className="input"
                value={form.from_date}
                onChange={(e) => setForm({ ...form, from_date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">To</label>
              <input
                type="date"
                className="input"
                value={form.to_date}
                onChange={(e) => setForm({ ...form, to_date: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Reason</label>
            <textarea
              className="input min-h-[90px] resize-none"
              placeholder="Brief reason for your leave"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? <Spinner /> : "Submit Request"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
