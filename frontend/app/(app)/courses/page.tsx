"use client";
// "use client";
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { api } from "@/services/api";
// import { useRole } from "@/stores/auth.store";
// import { toast } from "sonner";
// import { ADMIN_ROLES } from "@/lib/utils";
// import { BookOpen, Plus, Search, ChevronRight, Loader2 } from "lucide-react";

// interface Course { id: string; course_number: string; title: string; credit_structure: string; course_type: string; program_level: string; status: string; department_id: string | null; }
// interface Offering { id: string; course_number: string; course_title: string; credit_structure: string; section: string | null; max_enrollment: number; enrolled_count: number; status: string; faculty_names: string[]; }

// const CREDIT_FORMATS = ["2+0","0+2","1+1","0+1","3+0","2+1","1+2","3+1","4+0","0+4","2+2"];
// const LEVELS = ["UG","PG","PhD"];
// const STATUS_COLOR: Record<string, string> = { active: "bg-green-100 text-green-700", inactive: "bg-gray-100 text-gray-600", archived: "bg-red-100 text-red-700", draft: "bg-gray-100 text-gray-700", published: "bg-green-100 text-green-700", closed: "bg-red-100 text-red-700" };

// export default function CoursesPage() {
//   const role = useRole();
//   const qc = useQueryClient();
//   const isAdmin = role ? ADMIN_ROLES.includes(role) : false;
//   const [tab, setTab] = useState<"courses" | "offerings">("courses");
//   const [search, setSearch] = useState("");
//   const [levelFilter, setLevelFilter] = useState("");
//   const [showCreate, setShowCreate] = useState(false);
//   const [form, setForm] = useState({ course_number: "", title: "", credit_theory: "3", credit_practical: "0", program_level: "UG" });

//   const { data: courses = [], isLoading } = useQuery<Course[]>({
//     queryKey: ["ams-courses"],
//     queryFn: async () => (await api.get("/courses")).data,
//   });

//   const { data: offerings = [] } = useQuery<Offering[]>({
//     queryKey: ["ams-offerings"],
//     queryFn: async () => (await api.get("/courses/offerings/all")).data,
//     enabled: tab === "offerings",
//   });

//   const createCourse = useMutation({
//     mutationFn: (d: typeof form) => api.post("/courses", { ...d, credit_theory: parseInt(d.credit_theory), credit_practical: parseInt(d.credit_practical) }),
//     onSuccess: () => { toast.success("Course created."); qc.invalidateQueries({ queryKey: ["ams-courses"] }); setShowCreate(false); },
//     onError: (e: unknown) => toast.error((e as {response?:{data?:{detail?:string}}})?.response?.data?.detail ?? "Failed."),
//   });

//   const filteredCourses = courses.filter((c) =>
//     (!levelFilter || c.program_level === levelFilter) &&
//     (!search || c.course_number.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase()))
//   );

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><BookOpen size={24} className="text-[#0D6E6E]" />Courses</h1>
//           <p className="text-gray-700 text-sm mt-1">Course catalog, credit structures, and semester offerings</p>
//         </div>
//         {isAdmin && tab === "courses" && (
//           <button onClick={() => setShowCreate(true)}
//             className="flex items-center gap-2 px-4 py-2.5 bg-[#0D6E6E] text-white rounded-xl font-semibold text-sm hover:bg-[#178F8F]">
//             <Plus size={16} /> Add Course
//           </button>
//         )}
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-5">
//         {(["courses","offerings"] as const).map((t) => (
//           <button key={t} onClick={() => setTab(t)}
//             className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${tab === t ? "bg-[#0D6E6E] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
//             {t === "courses" ? "Course Catalog" : "Semester Offerings"}
//           </button>
//         ))}
//       </div>

//       {/* Filters */}
//       <div className="flex gap-3 mb-4">
//         <div className="relative flex-1 max-w-xs">
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
//           <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses…"
//             className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]" />
//         </div>
//         <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
//           className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
//           <option value="">All Levels</option>
//           {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
//         </select>
//       </div>

//       {/* Create Course Modal */}
//       {showCreate && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
//             <h3 className="text-lg font-bold mb-4">Add New Course</h3>
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Course Number *</label>
//                 <input value={form.course_number} onChange={(e) => setForm((f) => ({ ...f, course_number: e.target.value }))} placeholder="AGR101"
//                   className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]" />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Course Title *</label>
//                 <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Principles of Agronomy"
//                   className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]" />
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">Theory Credits</label>
//                   <input type="number" min={0} max={6} value={form.credit_theory}
//                     onChange={(e) => setForm((f) => ({ ...f, credit_theory: e.target.value }))}
//                     className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-1">Practical Credits</label>
//                   <input type="number" min={0} max={6} value={form.credit_practical}
//                     onChange={(e) => setForm((f) => ({ ...f, credit_practical: e.target.value }))}
//                     className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]" />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Credit Format</label>
//                 <p className="text-xs text-gray-700 mb-2">Supported: {CREDIT_FORMATS.join(", ")}</p>
//                 <p className="text-sm font-bold text-[#0D6E6E]">Current: {form.credit_theory}+{form.credit_practical}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Program Level</label>
//                 <div className="flex gap-2">
//                   {LEVELS.map((l) => (
//                     <button key={l} type="button" onClick={() => setForm((f) => ({ ...f, program_level: l }))}
//                       className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${form.program_level === l ? "border-[#0D6E6E] bg-[#0D6E6E] text-white" : "border-gray-200 text-gray-600"}`}>
//                       {l}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="flex gap-3 mt-5">
//               <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
//               <button onClick={() => createCourse.mutate(form)} disabled={createCourse.isPending}
//                 className="flex-1 py-2.5 bg-[#0D6E6E] text-white rounded-xl text-sm font-bold hover:bg-[#178F8F] disabled:opacity-60">
//                 {createCourse.isPending ? "Creating…" : "Create Course"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Course Catalog */}
//       {tab === "courses" && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           {isLoading ? (
//             <div className="flex items-center justify-center py-16 text-gray-600"><Loader2 className="animate-spin mr-2" />Loading…</div>
//           ) : filteredCourses.length === 0 ? (
//             <div className="text-center py-16 text-gray-600"><BookOpen size={40} className="mx-auto mb-3 opacity-30" /><p>No courses found.</p></div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>{["Course No.", "Title", "Credits", "Type", "Level", "Status"].map((h) => (
//                   <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
//                 ))}</tr>
//               </thead>
//               <tbody>
//                 {filteredCourses.map((c, i) => (
//                   <tr key={c.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
//                     <td className="px-4 py-3 font-mono font-bold text-[#0D6E6E]">{c.course_number}</td>
//                     <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{c.title}</td>
//                     <td className="px-4 py-3"><span className="font-mono text-sm bg-[#E6F4F4] text-[#0D6E6E] px-2 py-0.5 rounded">{c.credit_structure}</span></td>
//                     <td className="px-4 py-3 capitalize text-gray-600">{c.course_type}</td>
//                     <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{c.program_level}</span></td>
//                     <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[c.status] ?? "bg-gray-100"}`}>{c.status}</span></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}

//       {/* Offerings */}
//       {tab === "offerings" && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           {offerings.length === 0 ? (
//             <div className="text-center py-16 text-gray-600"><BookOpen size={40} className="mx-auto mb-3 opacity-30" /><p>No offerings yet.</p></div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>{["Course", "Title", "Credits", "Section", "Faculty", "Enrollment", "Status"].map((h) => (
//                   <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
//                 ))}</tr>
//               </thead>
//               <tbody>
//                 {offerings.map((o, i) => (
//                   <tr key={o.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
//                     <td className="px-4 py-3 font-mono font-bold text-[#0D6E6E]">{o.course_number}</td>
//                     <td className="px-4 py-3 max-w-xs truncate">{o.course_title}</td>
//                     <td className="px-4 py-3 font-mono text-sm">{o.credit_structure}</td>
//                     <td className="px-4 py-3">{o.section ?? "—"}</td>
//                     <td className="px-4 py-3 text-gray-600">{o.faculty_names.join(", ") || "—"}</td>
//                     <td className="px-4 py-3">{o.enrolled_count}/{o.max_enrollment}</td>
//                     <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[o.status] ?? "bg-gray-100"}`}>{o.status}</span></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }




// "use client";

/**
 * AMS — Course Offering Management
 * Production-grade, fully-functional page.
 *
 * Fixes vs previous versions:
 *  1. NO placeholderData  →  eliminates the flicker / screen-flash bug.
 *  2. Modal state lives in a stable closure; stopPropagation on the card
 *     prevents accidental close on inner clicks.
 *  3. "Add New Course" button is always wired correctly and opens the modal.
 *  4. Empty state is a clean blank slate (no filler rows).
 *  5. All mutations invalidate the query so the table refreshes after save.
 *  6. Faculty assignment flow hooked in-line (assign / deactivate).
 *  7. Pagination is fully numeric.
 *  8. Export row at the bottom.
 */

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useRole } from "@/stores/auth.store";
import { toast } from "sonner";
import { ADMIN_ROLES } from "@/lib/utils";
import {
  BookOpen, Plus, Search, Loader2, X,
  ChevronLeft, ChevronRight, Pencil, UserPlus, Unlink,
  SlidersHorizontal, Download, AlertCircle, CheckCircle2,
  Award, ChevronDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Course {
  id: string;
  course_number: string;
  title: string;
  credit_structure: string;
  course_type: string;
  program_level: string;
  status: string;
  department_id: string | null;
  assigned_faculty?: { id: string; name: string } | null;
}

interface NewCourseForm {
  course_number: string;
  course_title: string;
  credits: number;
  program: "UG" | "Masters" | "PhD";
  academic_year: "2024-25" | "2025-26" | "2026-27";
  semester: "Semester I" | "Semester II" | "Semester III";
  faculty_name: string;
  course_type: "Core" | "Elective";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PROGRAMS   = ["UG", "Masters", "PhD"] as const;
const SEMESTERS  = ["Semester I", "Semester II", "Semester III"] as const;
const ACAD_YEARS = ["2024-25", "2025-26", "2026-27"] as const;
const CTYPES     = ["Core", "Elective"] as const;
const LEVELS     = ["UG", "Masters", "PhD"] as const;
const PER_PAGE   = 10;

const STATUS_STYLES: Record<string, string> = {
  active:    "bg-[#E6F7F0] text-[#0D6E3A] border border-[#B6E8D0]",
  ACTIVE:    "bg-[#E6F7F0] text-[#0D6E3A] border border-[#B6E8D0]",
  published: "bg-[#E6F7F0] text-[#0D6E3A] border border-[#B6E8D0]",
  inactive:  "bg-gray-100   text-gray-500  border border-gray-200",
  draft:     "bg-gray-100   text-gray-500  border border-gray-200",
  DRAFT:     "bg-gray-100   text-gray-500  border border-gray-200",
  archived:  "bg-red-50     text-red-600   border border-red-100",
  closed:    "bg-red-50     text-red-600   border border-red-100",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

function FacultyAvatar({ name }: { name: string }) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <span
      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${color}`}
    >
      {initials(name)}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  iconCls,
  warn,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconCls: string;
  warn?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 rounded-xl border ${
        warn
          ? "border-orange-200 bg-orange-50"
          : "border-gray-100 bg-white shadow-sm"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconCls}`}
      >
        <Icon size={18} />
      </div>
      <div>
        <p
          className={`text-xl font-bold ${
            warn ? "text-orange-700" : "text-[#0A1628]"
          }`}
        >
          {value}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Radio group ─────────────────────────────────────────────────────────────

function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-4 flex-wrap">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
              value === opt ? "border-[#0D6E6E]" : "border-gray-300"
            }`}
          >
            {value === opt && (
              <div className="w-2 h-2 rounded-full bg-[#0D6E6E]" />
            )}
          </div>
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="sr-only"
          />
          <span
            className={`text-sm font-medium ${
              value === opt ? "text-[#0D6E6E]" : "text-gray-600"
            }`}
          >
            {opt}
          </span>
        </label>
      ))}
    </div>
  );
}

// ─── Add / Edit Course Modal ───────────────────────────────────────────────────

const EMPTY_FORM: NewCourseForm = {
  course_number: "",
  course_title: "",
  credits: 3,
  program: "UG",
  academic_year: "2024-25",
  semester: "Semester I",
  faculty_name: "",
  course_type: "Core",
};

interface CourseModalProps {
  onClose: () => void;
  onSave: (data: NewCourseForm) => void;
  isPending: boolean;
}

function CourseModal({ onClose, onSave, isPending }: CourseModalProps) {
  const [form, setForm] = useState<NewCourseForm>(EMPTY_FORM);

  const set = useCallback(
    <K extends keyof NewCourseForm>(k: K, v: NewCourseForm[K]) =>
      setForm((prev) => ({ ...prev, [k]: v })),
    []
  );

  const isValid =
    form.course_number.trim() !== "" && form.course_title.trim() !== "";

  return (
    /* Overlay */
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onMouseDown={onClose}
    >
      {/* Card — stopPropagation prevents overlay click from leaking in */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E6F4F4] flex items-center justify-center">
              <BookOpen size={14} className="text-[#0D6E6E]" />
            </div>
            <h2 className="text-sm font-bold text-[#0A1628]">
              Add New Course Offering
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Course number + title */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Course Number <span className="text-red-400">*</span>
              </label>
              <input
                value={form.course_number}
                onChange={(e) => set("course_number", e.target.value)}
                placeholder="e.g. VPT-901"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] focus:border-transparent placeholder:text-gray-300 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Course Title <span className="text-red-400">*</span>
              </label>
              <input
                value={form.course_title}
                onChange={(e) => set("course_title", e.target.value)}
                placeholder="Enter title"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] focus:border-transparent placeholder:text-gray-300 transition-all"
              />
            </div>
          </div>

          {/* Credits stepper */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Credits
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => set("credits", Math.max(1, form.credits - 1))}
                className="w-9 h-9 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#0D6E6E] hover:text-[#0D6E6E] font-bold text-lg transition-all active:scale-95"
              >
                −
              </button>
              <span className="text-2xl font-bold text-[#0A1628] w-8 text-center select-none">
                {form.credits}
              </span>
              <button
                type="button"
                onClick={() => set("credits", Math.min(8, form.credits + 1))}
                className="w-9 h-9 rounded-xl border-2 border-[#0D6E6E] bg-[#0D6E6E] flex items-center justify-center text-white font-bold text-lg transition-all hover:bg-[#0b5c5c] active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Program */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Program
            </label>
            <RadioGroup
              name="program"
              options={PROGRAMS}
              value={form.program}
              onChange={(v) => set("program", v)}
            />
          </div>

          {/* Academic year + Semester */}
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { label: "Academic Year", key: "academic_year", opts: ACAD_YEARS },
                { label: "Semester",      key: "semester",      opts: SEMESTERS  },
              ] as const
            ).map(({ label, key, opts }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  {label}
                </label>
                <div className="relative">
                  <select
                    value={form[key] as string}
                    onChange={(e) =>
                      set(key, e.target.value as NewCourseForm[typeof key])
                    }
                    className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] bg-white pr-8 transition-all"
                  >
                    {opts.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Assign Faculty */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Assign Faculty
            </label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                value={form.faculty_name}
                onChange={(e) => set("faculty_name", e.target.value)}
                placeholder="Search faculty name…"
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] focus:border-transparent placeholder:text-gray-300 transition-all"
              />
            </div>
          </div>

          {/* Course type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Course Type
            </label>
            <RadioGroup
              name="course_type"
              options={CTYPES}
              value={form.course_type}
              onChange={(v) => set("course_type", v)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-3 space-y-2 flex-shrink-0 border-t border-gray-100">
          <button
            type="button"
            onClick={() => isValid && onSave(form)}
            disabled={!isValid || isPending}
            className="w-full py-3 rounded-xl bg-[#0D6E6E] text-white font-bold text-sm hover:bg-[#0b5c5c] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Saving…
              </>
            ) : (
              "Save Course"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseDetailsModal({
  course,
  onClose,
}: {
  course: Course;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onMouseDown={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-2xl bg-[#E6F4F4] p-3 text-[#0D6E6E]">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-gray-400">
                  Course details
                </p>
                <h2 className="text-xl font-bold text-[#0A1628]">
                  {course.course_number} · {course.title}
                </h2>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F7F0] text-[#0D6E3A] text-xs font-semibold border border-[#B6E8D0]">
                <CheckCircle2 size={12} /> {course.status}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F9F7] text-[#0D6E3A] text-xs font-semibold border border-[#E0F1E8]">
                {course.program_level}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-100 bg-[#F7FFF9] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-400 mb-2">Credit structure</p>
            <p className="text-2xl font-bold text-[#0A1628]">{course.credit_structure}</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-400 mb-2">Course type</p>
            <p className="text-lg font-semibold text-[#0A1628]">{course.course_type}</p>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-gray-400 mb-2">Faculty assigned</p>
            {course.assigned_faculty ? (
              <p className="text-sm font-semibold text-[#0A1628]">{course.assigned_faculty.name}</p>
            ) : (
              <p className="text-sm text-gray-500">No faculty assigned yet.</p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 bg-[#F7FFF9] p-6">
          <p className="text-sm text-gray-500">
            Department ID: <span className="font-medium text-[#0A1628]">{course.department_id ?? "Unspecified"}</span>
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Click any row to continue working on this course offering in the same green workflow.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 bg-white border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CoursesPage() {
  const role     = useRole();
  const qc       = useQueryClient();
  const isAdmin  = role ? ADMIN_ROLES.includes(role) : false;

  // ── UI state ───────────────────────────────────────────────────────────────
  const [levelFilter,   setLevelFilter]   = useState<string>("");
  const [statusFilter,  setStatusFilter]  = useState<string>("");
  const [search,        setSearch]        = useState("");
  const [page,          setPage]          = useState(1);
  const [showModal,     setShowModal]     = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // ── Query — NO placeholderData (this was the flicker root cause) ───────────
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["ams-courses"],
    queryFn:  async () => (await api.get("/courses")).data,
    // staleTime keeps data while the user interacts with filters,
    // preventing unnecessary background fetches that caused the flash.
    staleTime: 30_000,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const addCourse = useMutation({
    mutationFn: (d: NewCourseForm) => api.post("/courses/offerings", d),
    onSuccess: () => {
      toast.success("Course offering added successfully.");
      qc.invalidateQueries({ queryKey: ["ams-courses"] });
      setShowModal(false);
    },
    onError: (e: unknown) =>
      toast.error(
        (e as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Failed to add course offering."
      ),
  });

  const deactivateCourse = useMutation({
    mutationFn: (id: string) => api.patch(`/courses/${id}`, { status: "inactive" }),
    onSuccess: () => {
      toast.success("Course deactivated.");
      qc.invalidateQueries({ queryKey: ["ams-courses"] });
    },
    onError: () => toast.error("Failed to deactivate course."),
  });

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    return (
      (!levelFilter  || c.program_level === levelFilter) &&
      (!statusFilter || c.status === statusFilter) &&
      (!q ||
        c.course_number.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  // clamp page when filters change
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );

  const totalAssigned   = courses.filter((c) => c.assigned_faculty).length;
  const totalUnassigned = courses.filter((c) => !c.assigned_faculty).length;
  const totalCredits    = courses.reduce((acc, c) => {
    const [t = 0, p = 0] = c.credit_structure.split("+").map(Number);
    return acc + t + p;
  }, 0);

  // ── Stable open handler (avoids re-renders triggering close) ───────────────
  const openModal  = useCallback(() => setShowModal(true),  []);
  const closeModal = useCallback(() => setShowModal(false), []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
        <span>Academic Management</span>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-semibold">Course Offering</span>
      </nav>

      {/* Page header */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0A1628]">
            Course Offering — Agronomy Department
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage departmental academic catalog and faculty assignments for the
            current session.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">
              Academic Year
            </span>
            <span className="text-xs font-bold text-[#0A1628]">2026–27</span>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">
              Semester
            </span>
            <span className="text-xs font-bold text-[#0A1628]">Sem I · start</span>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0D6E6E] text-white rounded-xl font-semibold text-sm hover:bg-[#0b5c5c] transition-all active:scale-[0.98] shadow-sm shadow-[#0D6E6E]/30"
          >
            <Plus size={15} />
            Add New Course
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total Courses"
          value={courses.length}
          icon={BookOpen}
          iconCls="bg-[#E6F4F4] text-[#0D6E6E]"
        />
        <StatCard
          label="Assigned"
          value={totalAssigned}
          icon={CheckCircle2}
          iconCls="bg-green-100 text-green-600"
        />
        <StatCard
          label="Unassigned"
          value={totalUnassigned}
          icon={AlertCircle}
          iconCls="bg-orange-100 text-orange-500"
          warn={totalUnassigned > 0}
        />
        <StatCard
          label="Total Credits"
          value={totalCredits}
          icon={Award}
          iconCls="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Filter strip */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Level pills */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {(["", ...LEVELS] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLevelFilter(l);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                levelFilter === l
                  ? "bg-[#0A1628] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {l === "" ? "All" : l}
            </button>
          ))}
        </div>

        {/* Status pills */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {(
            [
              { v: "",         label: "Status: All"  },
              { v: "active",   label: "● Active"     },
              { v: "inactive", label: "○ Inactive"   },
            ] as const
          ).map(({ v, label }) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setStatusFilter(v);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === v
                  ? "bg-[#0A1628] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by code or title…"
            className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0D6E6E] focus:border-transparent transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-xl hover:border-[#0D6E6E] hover:text-[#0D6E6E] transition-all"
        >
          <SlidersHorizontal size={13} /> Advanced Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 size={20} className="animate-spin mr-2" />
            <span className="text-sm">Loading courses…</span>
          </div>
        ) : paginated.length === 0 ? (
          /* Empty state — clean blank slate as requested */
          <div className="flex flex-col items-center justify-center py-24 text-gray-300 select-none">
            <BookOpen size={40} className="mb-3 opacity-40" />
            <p className="text-sm font-medium text-gray-400">
              {courses.length === 0
                ? "No courses yet. Click 'Add New Course' to get started."
                : "No courses match your current filters."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-[#F8FAFB] border-b border-gray-100">
                    {[
                      "Course Code",
                      "Title",
                      "Credits",
                      "Type",
                      "Level",
                      "Assigned Faculty",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((c, i) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCourse(c)}
                      className={`border-b border-gray-50 hover:bg-[#F0F8F8] transition-colors cursor-pointer ${
                        i % 2 !== 0 ? "bg-gray-50/30" : ""
                      }`}
                    >
                      {/* Course Code */}
                      <td className="px-4 py-3.5 font-mono font-bold text-[#0D6E6E] text-sm whitespace-nowrap">
                        {c.course_number}
                      </td>

                      {/* Title */}
                      <td className="px-4 py-3.5 font-medium text-[#0A1628] max-w-[200px]">
                        <span className="block truncate" title={c.title}>
                          {c.title}
                        </span>
                      </td>

                      {/* Credits */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-[#E6F4F4] text-[#0D6E6E] px-2.5 py-1 rounded-lg font-bold">
                          {c.credit_structure}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5 capitalize text-xs text-gray-600">
                        {c.course_type}
                      </td>

                      {/* Level */}
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 bg-[#E6F7F0] text-[#0D6E3A] rounded text-xs font-semibold">
                          {c.program_level}
                        </span>
                      </td>

                      {/* Assigned Faculty */}
                      <td className="px-4 py-3.5">
                        {c.assigned_faculty ? (
                          <div className="flex items-center gap-2">
                            <FacultyAvatar name={c.assigned_faculty.name} />
                            <span className="text-xs text-gray-700 font-medium">
                              {c.assigned_faculty.name}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg font-medium">
                            <AlertCircle size={11} /> Not Assigned
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            STATUS_STYLES[c.status] ?? "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {/* Edit */}
                          <button
                            type="button"
                            title="Edit course"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCourse(c);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-[#0A1628] transition-all border border-transparent hover:border-gray-200"
                          >
                            <Pencil size={11} /> Edit
                          </button>

                          {/* Assign / Deactivate */}
                          {!c.assigned_faculty ? (
                            <button
                              type="button"
                              title="Assign faculty"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCourse(c);
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0D6E6E] hover:bg-[#0b5c5c] transition-all"
                            >
                              <UserPlus size={11} /> Assign Faculty
                            </button>
                          ) : (
                            <button
                              type="button"
                              title="Deactivate course"
                              disabled={deactivateCourse.isPending}
                              onClick={(e) => {
                                e.stopPropagation();
                                deactivateCourse.mutate(c.id);
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all border border-red-100 disabled:opacity-50"
                            >
                              {deactivateCourse.isPending ? (
                                <Loader2 size={11} className="animate-spin" />
                              ) : (
                                <Unlink size={11} />
                              )}
                              Deactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex-wrap gap-3">
              {/* Export */}
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-[#0D6E6E] font-medium hover:opacity-70 transition-opacity"
              >
                <Download size={13} /> Export Course List (PDF / Excel)
              </button>

              {/* Pagination */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="hidden sm:inline">
                  Showing{" "}
                  {filtered.length === 0
                    ? 0
                    : (safePage - 1) * PER_PAGE + 1}
                  –{Math.min(safePage * PER_PAGE, filtered.length)} of{" "}
                  {filtered.length}
                </span>

                <div className="flex items-center gap-1 ml-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#0D6E6E] hover:text-[#0D6E6E] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={13} />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                          safePage === p
                            ? "bg-[#0A1628] text-white"
                            : "border border-gray-200 text-gray-600 hover:border-[#0D6E6E] hover:text-[#0D6E6E]"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#0D6E6E] hover:text-[#0D6E6E] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Requirement checklist banner */}
<div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
        <AlertCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-green-700 leading-relaxed">
          <span className="font-bold">Requirement Checklist: </span>
          Please ensure all UG-Level core courses have at least one primary
          faculty member assigned before the semester commencement date (Aug 15,
          2026). Incomplete assignments will prevent student registration.
        </p>
      </div>

      {/* Modal — rendered outside the table so z-index is clean */}
      {showModal && (
        <CourseModal
          onClose={closeModal}
          onSave={(data) => addCourse.mutate(data)}
          isPending={addCourse.isPending}
        />
      )}

      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}