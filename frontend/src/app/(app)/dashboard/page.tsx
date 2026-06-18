"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Users,
  Cake,
  UserPlus,
  Megaphone,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useApi } from "@/lib/useApi";
import { Avatar, MotionCard, Empty, Skeleton } from "@/components/ui";

interface Brief {
  id: number;
  full_name: string;
  designation: string;
  department: string;
}
interface Stats {
  leave_pending: number;
  leave_approved: number;
  attendance_present_days: number;
  pending_approvals: number;
  total_employees: number;
  birthdays_today: Brief[];
  new_joinings: Brief[];
  leave_balance: Record<string, number>;
}
interface Announcement {
  id: number;
  category: string;
  title: string;
  body: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, loading } = useApi<Stats>("/api/dashboard/stats");
  const { data: news } = useApi<Announcement[]>("/api/dashboard/announcements");
  const isStaff = user?.role !== "employee";

  const cards = [
    {
      label: "Leave Balance",
      value: stats
        ? Object.values(stats.leave_balance).reduce((a, b) => a + b, 0)
        : 0,
      suffix: "days",
      icon: CalendarDays,
      tone: "var(--color-green)",
    },
    {
      label: "Present This Month",
      value: stats?.attendance_present_days ?? 0,
      suffix: "days",
      icon: Clock,
      tone: "var(--color-success)",
    },
    {
      label: "Approved Leaves",
      value: stats?.leave_approved ?? 0,
      suffix: "",
      icon: CheckCircle2,
      tone: "var(--color-green)",
    },
    isStaff
      ? {
          label: "Pending Approvals",
          value: stats?.pending_approvals ?? 0,
          suffix: "",
          icon: Users,
          tone: "var(--color-warning)",
        }
      : {
          label: "Pending Leaves",
          value: stats?.leave_pending ?? 0,
          suffix: "",
          icon: Users,
          tone: "var(--color-warning)",
        },
  ];

  return (
    <div className="space-y-7">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden p-8 text-white"
        style={{
          background: "var(--color-green)",
          borderRadius: "var(--radius)",
          border: "1.5px solid var(--color-green-deep)",
        }}
      >
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <p className="text-white/75">Welcome to your workspace</p>
        <h1 className="mt-1 text-4xl font-bold">
          {user?.full_name}
        </h1>
        <p className="mt-3 max-w-lg text-white/80">
          Here is a calm overview of your day. Everything you need — leave,
          attendance and approvals — in one place.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c, i) =>
          loading ? (
            <Skeleton key={i} className="h-32" />
          ) : (
            <MotionCard key={c.label} delay={i * 0.06} className="!p-5">
              <div
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: `${c.tone}18`, color: c.tone }}
              >
                <c.icon size={22} />
              </div>
              <p className="text-sm font-medium text-[var(--color-ink-faint)]">
                {c.label}
              </p>
              <p className="mt-0.5 text-3xl font-bold text-[var(--color-ink)]">
                {c.value}
                {c.suffix && (
                  <span className="ml-1 text-base font-medium text-[var(--color-ink-faint)]">
                    {c.suffix}
                  </span>
                )}
              </p>
            </MotionCard>
          )
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Leave balance breakdown */}
        <MotionCard delay={0.1} className="lg:col-span-1">
          <h3 className="text-xl font-bold text-[var(--color-green-deep)]">
            Leave Balance
          </h3>
          <div className="gold-rule mt-2 mb-4" />
          <div className="space-y-4">
            {stats &&
              Object.entries(stats.leave_balance).map(([type, val]) => (
                <div key={type}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-[var(--color-ink-soft)]">
                      {type}
                    </span>
                    <span className="font-bold text-[var(--color-ink)]">
                      {val} days
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (val / 30) * 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--color-green), var(--color-green-soft))",
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
          <Link
            href="/leave"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-green)] hover:underline"
          >
            Apply for leave <ArrowUpRight size={16} />
          </Link>
        </MotionCard>

        {/* Birthdays + new joinings */}
        <MotionCard delay={0.16} className="lg:col-span-1">
          <h3 className="flex items-center gap-2 text-xl font-bold text-[var(--color-green-deep)]">
            <Cake size={20} /> Birthdays Today
          </h3>
          <div className="gold-rule mt-2 mb-4" />
          {stats && stats.birthdays_today.length > 0 ? (
            <ul className="space-y-3">
              {stats.birthdays_today.map((e) => (
                <li key={e.id} className="flex items-center gap-3">
                  <Avatar name={e.full_name} size={40} />
                  <div>
                    <p className="font-semibold text-[var(--color-ink)]">
                      {e.full_name}
                    </p>
                    <p className="text-sm text-[var(--color-ink-faint)]">
                      {e.designation}
                    </p>
                  </div>
                  <Cake size={20} className="ml-auto text-[var(--color-green)]" />
                </li>
              ))}
            </ul>
          ) : (
            <Empty message="No birthdays today" />
          )}

          <h3 className="mt-6 flex items-center gap-2 text-lg font-bold text-[var(--color-green-deep)]">
            <UserPlus size={18} /> New Joinings
          </h3>
          <ul className="mt-3 space-y-2">
            {stats?.new_joinings.slice(0, 3).map((e) => (
              <li key={e.id} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-green)]" />
                <span className="font-medium text-[var(--color-ink)]">
                  {e.full_name}
                </span>
                <span className="text-[var(--color-ink-faint)]">· {e.department}</span>
              </li>
            ))}
          </ul>
        </MotionCard>

        {/* News / circulars */}
        <MotionCard delay={0.22} className="lg:col-span-1">
          <h3 className="flex items-center gap-2 text-xl font-bold text-[var(--color-green-deep)]">
            <Megaphone size={20} /> Announcements
          </h3>
          <div className="gold-rule mt-2 mb-4" />
          {news && news.length > 0 ? (
            <ul className="space-y-4">
              {news.slice(0, 4).map((n) => (
                <li
                  key={n.id}
                  className="border-l-2 border-[var(--color-green)] pl-3"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--color-green)]">
                    {n.category}
                  </span>
                  <p className="font-semibold leading-snug text-[var(--color-ink)]">
                    {n.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm text-[var(--color-ink-faint)]">
                    {n.body}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <Empty message="No announcements yet" />
          )}
        </MotionCard>
      </div>
    </div>
  );
}
