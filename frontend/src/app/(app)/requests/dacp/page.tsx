"use client";

import { RequestModule, fmtDate } from "@/components/RequestModule";

interface DACP { id: number; current_grade: string; proposed_grade: string; due_date: string | null; remarks: string; status: string; }

export default function DACPPage() {
  return (
    <RequestModule<DACP>
      title="DACP"
      subtitle="Dynamic Assured Career Progression — apply for grade advancement."
      endpoint="/api/dacp"
      ctaLabel="New DACP Request"
      fields={[
        { name: "current_grade", label: "Current Grade", type: "text", required: true, placeholder: "e.g. Grade III" },
        { name: "proposed_grade", label: "Proposed Grade", type: "text", required: true, placeholder: "e.g. Grade II" },
        { name: "due_date", label: "Due Date", type: "date" },
        { name: "remarks", label: "Remarks", type: "textarea" },
      ]}
      columns={[
        { header: "Current", cell: (r) => <span className="font-semibold">{r.current_grade}</span> },
        { header: "Proposed", cell: (r) => r.proposed_grade },
        { header: "Due", cell: (r) => fmtDate(r.due_date) },
      ]}
    />
  );
}
