"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { SectionTitle, Avatar, Empty, Skeleton, StatusBadge } from "@/components/ui";

interface Emp {
  id: number;
  full_name: string;
  designation: string;
  department: string;
  office: string;
  status: string;
}

export default function DirectoryPage() {
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

  return (
    <div>
      <SectionTitle title="Employee Directory" subtitle="Search colleagues across all departments." />

      <div className="relative mb-6 max-w-xl">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
        <input
          className="input pl-12"
          placeholder="Search by name, designation or department…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : rows.length === 0 ? (
        <Empty message="No employees found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              whileHover={{ y: -3 }}
              className="card flex items-start gap-4 p-5"
            >
              <Avatar name={e.full_name} size={52} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-bold text-[var(--color-ink)]">{e.full_name}</p>
                <p className="truncate text-sm text-[var(--color-ink-soft)]">{e.designation}</p>
                <p className="truncate text-sm text-[var(--color-ink-faint)]">{e.department}</p>
                <div className="mt-2"><StatusBadge status={e.status} /></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
