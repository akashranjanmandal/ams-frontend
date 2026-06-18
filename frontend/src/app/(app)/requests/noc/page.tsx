"use client";

import { RequestModule, fmtDate } from "@/components/RequestModule";

interface NOC { id: number; purpose: string; country: string; from_date: string | null; to_date: string | null; status: string; }

export default function NOCPage() {
  return (
    <RequestModule<NOC>
      title="No Objection Certificate"
      subtitle="Request an NOC for travel, higher studies or other purposes."
      endpoint="/api/noc"
      ctaLabel="Request NOC"
      fields={[
        { name: "purpose", label: "Purpose", type: "text", required: true, placeholder: "e.g. Foreign travel, Passport" },
        { name: "country", label: "Country (if travel)", type: "text", placeholder: "e.g. United Kingdom" },
        { name: "from_date", label: "From Date", type: "date" },
        { name: "to_date", label: "To Date", type: "date" },
        { name: "details", label: "Additional Details", type: "textarea" },
      ]}
      columns={[
        { header: "Purpose", cell: (r) => <span className="font-semibold">{r.purpose}</span> },
        { header: "Country", cell: (r) => r.country || "—" },
        { header: "From", cell: (r) => fmtDate(r.from_date) },
        { header: "To", cell: (r) => fmtDate(r.to_date) },
      ]}
    />
  );
}
