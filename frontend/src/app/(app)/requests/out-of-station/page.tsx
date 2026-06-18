"use client";

import { RequestModule, fmtDate } from "@/components/RequestModule";

interface OOS { id: number; destination: string; purpose: string; from_date: string; to_date: string; status: string; }

export default function OutOfStationPage() {
  return (
    <RequestModule<OOS>
      title="Out of Station"
      subtitle="Record official out-of-station movement."
      endpoint="/api/out-of-station"
      ctaLabel="New Request"
      fields={[
        { name: "destination", label: "Destination", type: "text", required: true, placeholder: "e.g. New Delhi" },
        { name: "purpose", label: "Purpose", type: "text", placeholder: "e.g. Conference" },
        { name: "from_date", label: "From Date", type: "date", required: true },
        { name: "to_date", label: "To Date", type: "date", required: true },
      ]}
      columns={[
        { header: "Destination", cell: (r) => <span className="font-semibold">{r.destination}</span> },
        { header: "Purpose", cell: (r) => r.purpose || "—" },
        { header: "From", cell: (r) => fmtDate(r.from_date) },
        { header: "To", cell: (r) => fmtDate(r.to_date) },
      ]}
    />
  );
}
