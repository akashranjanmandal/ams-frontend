"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { useToast } from "@/components/Toast";
import { Avatar, SectionTitle, StatusBadge, Skeleton, Empty, Spinner } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { fmtDate } from "@/lib/format";

interface Family { id: number; member_name: string; date_of_birth: string | null; occupation: string; relation: string; dependent: boolean; }
interface Emergency { id: number; person_name: string; contact_no: string; relation: string; email: string; address: string; }
interface Qual { id: number; degree: string; institution: string; year: string; grade: string; }
interface Exp { id: number; organization: string; designation: string; from_date: string | null; to_date: string | null; }
interface Profile {
  full_name: string; designation: string; grade: string; department: string; office: string; status: string;
  gender: string; date_of_birth: string | null; blood_group: string; nationality: string; religion: string; marital_status: string;
  phone: string; alt_phone: string; address: string; city: string; state: string; pincode: string;
  pan: string; aadhaar: string; bank_account: string; bank_ifsc: string; bank_name: string; date_of_joining: string | null;
  family: Family[]; emergency_contacts: Emergency[]; qualifications: Qual[]; experiences: Exp[];
}
interface EditReq { id: number; changes: Record<string, { old: string; new: string }>; status: string; applied_at: string; }

const TABS = ["Personal", "Address", "Qualification", "Experience", "Family", "Emergency", "Bank", "Edit Requests"] as const;
type Tab = (typeof TABS)[number];

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm font-medium text-[var(--color-ink-faint)]">{label}</p>
      <p className="mt-0.5 text-[17px] font-semibold text-[var(--color-ink)]">{value || "—"}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { data: p, loading, reload } = useApi<Profile>("/api/employees/me");
  const { data: edits, reload: reloadEdits } = useApi<EditReq[]>("/api/employees/my-edit-requests");
  const { push } = useToast();
  const [tab, setTab] = useState<Tab>("Personal");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  function openEdit() {
    if (!p) return;
    setForm({
      phone: p.phone, alt_phone: p.alt_phone, address: p.address, city: p.city,
      state: p.state, pincode: p.pincode, blood_group: p.blood_group, marital_status: p.marital_status,
      bank_account: p.bank_account, bank_ifsc: p.bank_ifsc, bank_name: p.bank_name,
      full_name: p.full_name, designation: p.designation, department: p.department, grade: p.grade,
    });
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.put<{ instant_applied: string[]; pending_fields: string[] }>("/api/employees/me", form);
      const inst = res.instant_applied.length;
      const pend = res.pending_fields.length;
      if (inst && pend) push("success", `${inst} field(s) updated. ${pend} official change(s) sent for approval.`);
      else if (pend) push("info", `${pend} official change(s) sent to HR/Admin for approval.`);
      else if (inst) push("success", `Profile updated.`);
      else push("info", "No changes made.");
      setOpen(false);
      reload();
      reloadEdits();
    } catch (err) {
      push("error", err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !p)
    return <div><SectionTitle title="My Profile" /><Skeleton className="h-64" /></div>;

  const OFFICIAL = ["full_name", "designation", "department", "grade"];
  const INSTANT_FIELDS: [string, string][] = [
    ["phone", "Phone"], ["alt_phone", "Alternate Phone"], ["address", "Address"],
    ["city", "City"], ["state", "State"], ["pincode", "Pincode"],
    ["blood_group", "Blood Group"], ["marital_status", "Marital Status"],
    ["bank_account", "Bank Account"], ["bank_ifsc", "IFSC Code"], ["bank_name", "Bank Name"],
  ];
  const OFFICIAL_FIELDS: [string, string][] = [
    ["full_name", "Full Name"], ["designation", "Designation"],
    ["department", "Department"], ["grade", "Grade"],
  ];

  return (
    <div>
      <SectionTitle title="My Profile" subtitle="Your official record. You can edit your details anytime." />

      {/* Identity header (boxy, green) */}
      <div
        className="mb-6 flex flex-col items-start gap-5 p-7 text-white sm:flex-row sm:items-center"
        style={{ background: "var(--color-green)", borderRadius: "var(--radius)", border: "1.5px solid var(--color-green-deep)" }}
      >
        <Avatar name={p.full_name} size={80} />
        <div className="flex-1">
          <h2 className="text-3xl font-bold">{p.full_name}</h2>
          <p className="mt-1 text-white/85">{p.designation} · {p.department}</p>
          <p className="text-sm text-white/70">{p.office}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="px-4 py-2 text-center" style={{ background: "rgba(255,255,255,0.12)", borderRadius: "var(--radius-sm)" }}>
            <p className="text-xs uppercase tracking-wide text-white/70">Status</p>
            <div className="mt-1"><StatusBadge status={p.status} /></div>
          </div>
          <button onClick={openEdit} className="btn btn-ghost !bg-white !py-2 !px-4 text-sm">
            <Pencil size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative px-4 py-2.5 text-[15px] font-semibold transition-colors"
            style={{ color: tab === t ? "#fff" : "var(--color-ink-soft)", borderRadius: "var(--radius-sm)" }}
          >
            {tab === t && (
              <motion.span
                layoutId="profile-tab"
                className="absolute inset-0"
                style={{ background: "var(--color-green)", borderRadius: "var(--radius-sm)" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{t}{t === "Edit Requests" && edits?.some((e) => e.status === "pending") ? " •" : ""}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="card p-7"
        >
          {tab === "Personal" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Field label="Employee Name" value={p.full_name} />
              <Field label="Designation" value={p.designation} />
              <Field label="Grade" value={p.grade} />
              <Field label="Department" value={p.department} />
              <Field label="Gender" value={p.gender} />
              <Field label="Date of Birth" value={fmtDate(p.date_of_birth)} />
              <Field label="Blood Group" value={p.blood_group} />
              <Field label="Nationality" value={p.nationality} />
              <Field label="Religion" value={p.religion} />
              <Field label="Marital Status" value={p.marital_status} />
              <Field label="PAN" value={p.pan} />
              <Field label="Date of Joining" value={fmtDate(p.date_of_joining)} />
            </div>
          )}
          {tab === "Address" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Phone" value={p.phone} />
              <Field label="Alternate Phone" value={p.alt_phone} />
              <div className="sm:col-span-2"><Field label="Address" value={p.address} /></div>
              <Field label="City" value={p.city} />
              <Field label="State" value={p.state} />
              <Field label="Pincode" value={p.pincode} />
            </div>
          )}
          {tab === "Qualification" && (
            p.qualifications.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {p.qualifications.map((q) => (
                  <div key={q.id} className="border border-[var(--color-line)] bg-[var(--color-bg)] p-4" style={{ borderRadius: "var(--radius)" }}>
                    <p className="text-lg font-bold text-[var(--color-green-deep)]">{q.degree}</p>
                    <p className="text-[var(--color-ink-soft)]">{q.institution}</p>
                    <p className="text-sm text-[var(--color-ink-faint)]">Year {q.year} · {q.grade}</p>
                  </div>
                ))}
              </div>
            ) : <Empty message="No qualifications recorded" />
          )}
          {tab === "Experience" && (
            p.experiences.length ? (
              <div className="space-y-3">
                {p.experiences.map((e) => (
                  <div key={e.id} className="border-l-4 border-[var(--color-green)] pl-4">
                    <p className="font-semibold text-[var(--color-ink)]">{e.designation}</p>
                    <p className="text-[var(--color-ink-soft)]">{e.organization}</p>
                    <p className="text-sm text-[var(--color-ink-faint)]">{fmtDate(e.from_date)} – {fmtDate(e.to_date)}</p>
                  </div>
                ))}
              </div>
            ) : <Empty message="No experience recorded" />
          )}
          {tab === "Family" && (
            p.family.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {p.family.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 border border-[var(--color-line)] p-4" style={{ borderRadius: "var(--radius)" }}>
                    <Avatar name={f.member_name} size={42} />
                    <div>
                      <p className="font-semibold text-[var(--color-ink)]">{f.member_name}</p>
                      <p className="text-sm text-[var(--color-ink-faint)]">{f.relation} · {f.occupation || "—"}{f.dependent ? " · Dependent" : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <Empty message="No family members recorded" />
          )}
          {tab === "Emergency" && (
            p.emergency_contacts.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {p.emergency_contacts.map((c) => (
                  <div key={c.id} className="border border-[var(--color-line)] p-4" style={{ borderRadius: "var(--radius)" }}>
                    <p className="font-semibold text-[var(--color-ink)]">{c.person_name} <span className="text-sm font-normal text-[var(--color-ink-faint)]">({c.relation})</span></p>
                    <p className="text-[var(--color-ink-soft)]">{c.contact_no}{c.email ? ` · ${c.email}` : ""}</p>
                    <p className="text-sm text-[var(--color-ink-faint)]">{c.address}</p>
                  </div>
                ))}
              </div>
            ) : <Empty message="No emergency contacts" />
          )}
          {tab === "Bank" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Field label="Bank Account" value={p.bank_account} />
              <Field label="IFSC Code" value={p.bank_ifsc} />
              <Field label="Bank Name" value={p.bank_name} />
            </div>
          )}
          {tab === "Edit Requests" && (
            edits && edits.length ? (
              <div className="space-y-3">
                {edits.map((r) => (
                  <div key={r.id} className="flex items-start justify-between gap-4 border border-[var(--color-line)] p-4" style={{ borderRadius: "var(--radius)" }}>
                    <div>
                      {Object.entries(r.changes).map(([field, v]) => (
                        <p key={field} className="text-[15px]">
                          <span className="font-semibold capitalize">{field.replace("_", " ")}:</span>{" "}
                          <span className="text-[var(--color-ink-faint)] line-through">{v.old || "—"}</span>{" → "}
                          <span className="font-semibold text-[var(--color-green-deep)]">{v.new}</span>
                        </p>
                      ))}
                      <p className="mt-1 text-xs text-[var(--color-ink-faint)]">Requested {fmtDate(r.applied_at)}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            ) : <Empty message="No profile change requests" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Edit modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Edit Profile">
        <form onSubmit={save} className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--color-green)]">Contact &amp; Personal — applies instantly</p>
            <div className="grid grid-cols-2 gap-3">
              {INSTANT_FIELDS.map(([key, lbl]) => (
                <div key={key} className={key === "address" ? "col-span-2" : ""}>
                  <label className="label">{lbl}</label>
                  <input className="input" value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-[var(--color-warn)]">Official — needs HR/Admin approval</p>
            <div className="grid grid-cols-2 gap-3">
              {OFFICIAL_FIELDS.map(([key, lbl]) => (
                <div key={key}>
                  <label className="label">{lbl}</label>
                  <input className="input" value={form[key] ?? ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary w-full" disabled={busy}>{busy ? <Spinner /> : "Save Changes"}</button>
        </form>
      </Modal>
    </div>
  );
}
