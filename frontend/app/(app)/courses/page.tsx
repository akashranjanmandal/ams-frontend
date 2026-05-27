"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useRole } from "@/stores/auth.store";
import { toast } from "sonner";
import { ADMIN_ROLES } from "@/lib/utils";
import { BookOpen, Plus, Search, ChevronRight, Loader2 } from "lucide-react";

interface Course { id: string; course_number: string; title: string; credit_structure: string; course_type: string; program_level: string; status: string; department_id: string | null; }
interface Offering { id: string; course_number: string; course_title: string; credit_structure: string; section: string | null; max_enrollment: number; enrolled_count: number; status: string; faculty_names: string[]; }

const CREDIT_FORMATS = ["2+0","0+2","1+1","0+1","3+0","2+1","1+2","3+1","4+0","0+4","2+2"];
const LEVELS = ["UG","PG","PhD"];
const STATUS_COLOR: Record<string, string> = { active: "bg-green-100 text-green-700", inactive: "bg-gray-100 text-gray-600", archived: "bg-red-100 text-red-700", draft: "bg-gray-100 text-gray-700", published: "bg-green-100 text-green-700", closed: "bg-red-100 text-red-700" };

export default function CoursesPage() {
  const role = useRole();
  const qc = useQueryClient();
  const isAdmin = role ? ADMIN_ROLES.includes(role) : false;
  const [tab, setTab] = useState<"courses" | "offerings">("courses");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ course_number: "", title: "", credit_theory: "3", credit_practical: "0", program_level: "UG" });

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["ams-courses"],
    queryFn: async () => (await api.get("/courses")).data,
  });

  const { data: offerings = [] } = useQuery<Offering[]>({
    queryKey: ["ams-offerings"],
    queryFn: async () => (await api.get("/courses/offerings/all")).data,
    enabled: tab === "offerings",
  });

  const createCourse = useMutation({
    mutationFn: (d: typeof form) => api.post("/courses", { ...d, credit_theory: parseInt(d.credit_theory), credit_practical: parseInt(d.credit_practical) }),
    onSuccess: () => { toast.success("Course created."); qc.invalidateQueries({ queryKey: ["ams-courses"] }); setShowCreate(false); },
    onError: (e: unknown) => toast.error((e as {response?:{data?:{detail?:string}}})?.response?.data?.detail ?? "Failed."),
  });

  const filteredCourses = courses.filter((c) =>
    (!levelFilter || c.program_level === levelFilter) &&
    (!search || c.course_number.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><BookOpen size={24} className="text-[#0D6E6E]" />Courses</h1>
          <p className="text-gray-700 text-sm mt-1">Course catalog, credit structures, and semester offerings</p>
        </div>
        {isAdmin && tab === "courses" && (
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0D6E6E] text-white rounded-xl font-semibold text-sm hover:bg-[#178F8F]">
            <Plus size={16} /> Add Course
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["courses","offerings"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${tab === t ? "bg-[#0D6E6E] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            {t === "courses" ? "Course Catalog" : "Semester Offerings"}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]" />
        </div>
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none">
          <option value="">All Levels</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Create Course Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Add New Course</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Course Number *</label>
                <input value={form.course_number} onChange={(e) => setForm((f) => ({ ...f, course_number: e.target.value }))} placeholder="AGR101"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Course Title *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Principles of Agronomy"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Theory Credits</label>
                  <input type="number" min={0} max={6} value={form.credit_theory}
                    onChange={(e) => setForm((f) => ({ ...f, credit_theory: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Practical Credits</label>
                  <input type="number" min={0} max={6} value={form.credit_practical}
                    onChange={(e) => setForm((f) => ({ ...f, credit_practical: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Credit Format</label>
                <p className="text-xs text-gray-700 mb-2">Supported: {CREDIT_FORMATS.join(", ")}</p>
                <p className="text-sm font-bold text-[#0D6E6E]">Current: {form.credit_theory}+{form.credit_practical}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Program Level</label>
                <div className="flex gap-2">
                  {LEVELS.map((l) => (
                    <button key={l} type="button" onClick={() => setForm((f) => ({ ...f, program_level: l }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${form.program_level === l ? "border-[#0D6E6E] bg-[#0D6E6E] text-white" : "border-gray-200 text-gray-600"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => createCourse.mutate(form)} disabled={createCourse.isPending}
                className="flex-1 py-2.5 bg-[#0D6E6E] text-white rounded-xl text-sm font-bold hover:bg-[#178F8F] disabled:opacity-60">
                {createCourse.isPending ? "Creating…" : "Create Course"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Catalog */}
      {tab === "courses" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-600"><Loader2 className="animate-spin mr-2" />Loading…</div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16 text-gray-600"><BookOpen size={40} className="mx-auto mb-3 opacity-30" /><p>No courses found.</p></div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{["Course No.", "Title", "Credits", "Type", "Level", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filteredCourses.map((c, i) => (
                  <tr key={c.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-4 py-3 font-mono font-bold text-[#0D6E6E]">{c.course_number}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{c.title}</td>
                    <td className="px-4 py-3"><span className="font-mono text-sm bg-[#E6F4F4] text-[#0D6E6E] px-2 py-0.5 rounded">{c.credit_structure}</span></td>
                    <td className="px-4 py-3 capitalize text-gray-600">{c.course_type}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{c.program_level}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[c.status] ?? "bg-gray-100"}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Offerings */}
      {tab === "offerings" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {offerings.length === 0 ? (
            <div className="text-center py-16 text-gray-600"><BookOpen size={40} className="mx-auto mb-3 opacity-30" /><p>No offerings yet.</p></div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{["Course", "Title", "Credits", "Section", "Faculty", "Enrollment", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {offerings.map((o, i) => (
                  <tr key={o.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-4 py-3 font-mono font-bold text-[#0D6E6E]">{o.course_number}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{o.course_title}</td>
                    <td className="px-4 py-3 font-mono text-sm">{o.credit_structure}</td>
                    <td className="px-4 py-3">{o.section ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{o.faculty_names.join(", ") || "—"}</td>
                    <td className="px-4 py-3">{o.enrolled_count}/{o.max_enrollment}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[o.status] ?? "bg-gray-100"}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
