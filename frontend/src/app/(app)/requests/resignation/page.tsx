"use client";

import { RequestModule, fmtDate } from "@/components/RequestModule";

interface Res { id: number; resignation_type: string; last_working_date: string | null; reason: string; status: string; }

export default function ResignationPage() {
  return (
    <RequestModule<Res>
      title="Resignation Management"
      subtitle="Submit a resignation or relieve request."
      endpoint="/api/resignation"
      ctaLabel="New Request"
      fields={[
        { name: "resignation_type", label: "Type", type: "select", options: ["Resignation", "Voluntary Retirement", "Relieve Request"] },
        { name: "last_working_date", label: "Last Working Date", type: "date" },
        { name: "reason", label: "Reason", type: "textarea", placeholder: "Reason for resignation" },
      ]}
      columns={[
        { header: "Type", cell: (r) => <span className="font-semibold">{r.resignation_type}</span> },
        { header: "Last Working Day", cell: (r) => fmtDate(r.last_working_date) },
        { header: "Reason", cell: (r) => <span className="text-[var(--color-ink-soft)]">{r.reason || "—"}</span> },
      ]}
    />
  );
}
