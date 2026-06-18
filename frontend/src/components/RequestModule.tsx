"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { useToast } from "@/components/Toast";
import { SectionTitle, StatusBadge, Spinner } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { DataTable, Column } from "@/components/DataTable";
import { fmtDate } from "@/lib/format";

export interface FieldDef {
  name: string;
  label: string;
  type: "text" | "date" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface Props<T> {
  title: string;
  subtitle: string;
  endpoint: string; // e.g. "/api/noc"
  fields: FieldDef[];
  columns: Column<T>[];
  ctaLabel?: string;
}

export function RequestModule<T extends { id: number; status: string }>({
  title,
  subtitle,
  endpoint,
  fields,
  columns,
  ctaLabel = "New Request",
}: Props<T>) {
  const { data, loading, reload } = useApi<T[]>(`${endpoint}/mine`);
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(
      fields.map((f) => [f.name, f.type === "select" ? f.options?.[0] ?? "" : ""])
    )
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        const v = form[f.name];
        payload[f.name] = f.type === "date" && !v ? null : v;
      }
      await api.post(endpoint, payload);
      push("success", `${title} request submitted.`);
      setOpen(false);
      setForm(Object.fromEntries(fields.map((f) => [f.name, f.type === "select" ? f.options?.[0] ?? "" : ""])));
      reload();
    } catch (err) {
      push("error", err instanceof ApiError ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  const cols: Column<T>[] = [
    ...columns,
    { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <SectionTitle title={title} subtitle={subtitle} />
        <button onClick={() => setOpen(true)} className="btn btn-primary mb-6">
          <Plus size={18} /> {ctaLabel}
        </button>
      </div>

      <DataTable columns={cols} rows={data ?? []} loading={loading} empty="No requests yet" />

      <Modal open={open} onClose={() => setOpen(false)} title={ctaLabel}>
        <form onSubmit={submit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  className="input min-h-[90px] resize-none"
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  required={f.required}
                />
              ) : f.type === "select" ? (
                <select
                  className="input"
                  value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                >
                  {f.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type}
                  className="input"
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  required={f.required}
                />
              )}
            </div>
          ))}
          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? <Spinner /> : "Submit Request"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export { fmtDate };
