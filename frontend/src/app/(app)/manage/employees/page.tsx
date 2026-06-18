"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { SectionTitle, Avatar, StatusBadge, MotionCard } from "@/components/ui";
import { DataTable, Column } from "@/components/DataTable";

interface Emp {
  id: number;
  full_name: string;
  designation: string;
  department: string;
  office: string;
  status: string;
}

export default function ManageEmployeesPage() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Emp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.get<Emp[]>(`/api/employees/directory?q=${encodeURIComponent(q)}`);
        setRows(data);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const departments = new Set(rows.map((r) => r.department)).size;

  const columns: Column<Emp>[] = [
    {
      header: "Employee",
      cell: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.full_name} size={38} />
          <span className="font-semibold">{r.full_name}</span>
        </div>
      ),
    },
    { header: "Designation", cell: (r) => r.designation },
    { header: "Department", cell: (r) => r.department },
    { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <SectionTitle title="All Employees" subtitle={`Manage the university's workforce${user?.role === "admin" ? " (Administrator)" : ""}.`} />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MotionCard className="!p-5">
          <p className="text-sm text-[var(--color-ink-faint)]">Total Employees</p>
          <p className="text-3xl font-bold text-[var(--color-green-deep)]">{rows.length}</p>
        </MotionCard>
        <MotionCard delay={0.06} className="!p-5">
          <p className="text-sm text-[var(--color-ink-faint)]">Departments</p>
          <p className="text-3xl font-bold text-[var(--color-green-deep)]">{departments}</p>
        </MotionCard>
        <MotionCard delay={0.12} className="!p-5">
          <p className="text-sm text-[var(--color-ink-faint)]">Working</p>
          <p className="text-3xl font-bold text-[var(--color-success)]">
            {rows.filter((r) => r.status === "Working").length}
          </p>
        </MotionCard>
      </div>

      <div className="relative mb-5 max-w-xl">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
        <input
          className="input pl-12"
          placeholder="Search employees…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} empty="No employees found" />
    </div>
  );
}
