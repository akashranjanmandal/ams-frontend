"use client";

import { RequestModule, fmtDate } from "@/components/RequestModule";

interface Vac { id: number; from_date: string; to_date: string; total_days: number; reason: string; status: string; }

export default function VacationPage() {
  return (
    <RequestModule<Vac>
      title="Vacation Department"
      subtitle="Apply for vacation-department leave and track its status."
      endpoint="/api/vacation"
      ctaLabel="Request Vacation"
      fields={[
        { name: "from_date", label: "From Date", type: "date", required: true },
        { name: "to_date", label: "To Date", type: "date", required: true },
        { name: "reason", label: "Reason", type: "textarea", placeholder: "Reason for vacation" },
      ]}
      columns={[
        { header: "From", cell: (r) => <span className="font-semibold">{fmtDate(r.from_date)}</span> },
        { header: "To", cell: (r) => fmtDate(r.to_date) },
        { header: "Days", cell: (r) => r.total_days },
        { header: "Reason", cell: (r) => <span className="text-[var(--color-ink-soft)]">{r.reason || "—"}</span> },
      ]}
    />
  );
}
