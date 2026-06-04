
// "use client";
// import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { api } from "@/services/api";
// import { useUser, useRole, useAuthStore } from "@/stores/auth.store";
// import { ROLES } from "@/lib/utils";
// import {
//   GraduationCap, BookOpen, Users, CalendarDays, ClipboardList,
//   BarChart3, Bell, TrendingUp, CheckCircle2, Clock, AlertCircle,
//   BookMarked, FileText, UserCheck, Layers, ChevronRight,
//   Award, Target, Activity, Briefcase, User2, Mail,
//   Percent, BookCopy, ClipboardCheck, School, Building2
// } from "lucide-react";
// import Link from "next/link";

// // ── Brand colors (from screenshots) ──────────────────────────────────────────
// // Primary navy:    #0A1628
// // Accent teal:     #0D6E6E  (sidebar active, borders)
// // Card blue:       #1E40AF  (info badges)
// // Soft bg:         #F0F4FF
// // ─────────────────────────────────────────────────────────────────────────────

// // ── Types ─────────────────────────────────────────────────────────────────────
// interface StatCard {
//   label: string;
//   value: string | number;
//   sub?: string;
//   trend?: "up" | "down" | "neutral";
//   color: string;        // tailwind bg class
//   textColor: string;    // tailwind text class
//   icon: React.ComponentType<{ size?: number; className?: string }>;
// }

// interface QuickLink {
//   label: string;
//   href: string;
//   icon: React.ComponentType<{ size?: number; className?: string }>;
//   badge?: string | number;
//   badgeColor?: string;
// }

// // ── Hooks ─────────────────────────────────────────────────────────────────────
// function useStudentData() {
//   return useQuery({
//     queryKey: ["student-dashboard"],
//     queryFn: async () => (await api.get("/student/dashboard")).data,
//     placeholderData: {
//       gpa: "8.42",
//       creditsEarned: 54,
//       creditsPending: 18,
//       activeCourses: 6,
//       attendance: 88,
//       enrolledCourses: [
//         { code: "AGR-502", name: "Advanced Agronomy", instructor: "Dr. T. Barak", attendance: 92, grade: "A" },
//         { code: "PLT-502", name: "Plant Pathology", instructor: "Dr. R. Mehta", attendance: 88, grade: "B+" },
//         { code: "SBC-503", name: "Crop Management", instructor: "Dr. C. Borah", attendance: 79, grade: "A-" },
//       ],
//       upcomingExams: [
//         { subject: "Plant Pathology", date: "Jun 04", time: "10:00 AM", room: "Hall A" },
//         { subject: "Term Assessment", date: "Jun 10", time: "02:00 PM", room: "Hall B" },
//       ],
//       recentGrades: [
//         { course: "AGR-502", component: "Mid-Term Exam", marks: "42/50", grade: "A" },
//         { course: "PLT-502", component: "Lab Assignment", marks: "18/20", grade: "A+" },
//         { course: "SBC-503", component: "Quiz 2", marks: "08/10", grade: "B+" },
//       ],
//       notifications: [
//         { type: "info", text: "Registration open for Sem IV — deadline Oct 28", time: "2h ago" },
//         { type: "warning", text: "Fee payment due by Nov 4", time: "5h ago" },
//         { type: "success", text: "Grade published: AGR-502 Mid-Term", time: "1d ago" },
//       ],
//     },
//   });
// }

// function useFacultyData() {
//   return useQuery({
//     queryKey: ["faculty-dashboard"],
//     queryFn: async () => (await api.get("/faculty/dashboard")).data,
//     placeholderData: {
//       coursesThisSem: 4,
//       totalStudents: 142,
//       pendingGradeSheets: 2,
//       advisees: 7,
//       courses: [
//         { code: "AGR-401", name: "Principles of Agronomy", students: 38, credits: "3+0+1", status: "Active" },
//         { code: "AGR-502", name: "Advanced Agronomy", students: 28, credits: "3+0+1", status: "Active" },
//         { code: "AGRO-HE1", name: "Advanced Crop Physiology", students: 41, credits: "1+0+1", status: "Active" },
//         { code: "AGR-601", name: "Weed Management", students: 35, credits: "2+0+1", status: "Active" },
//       ],
//       pendingApprovals: [
//         { student: "Simran Bansal", rollNo: "S.C. Markuss", date: "Oct 24, 2024", course: "AGR-401" },
//         { student: "Anurag Goswami", rollNo: "S.C. Markuss", date: "Oct 24, 2024", course: "AGR-502" },
//       ],
//       upcomingSchedule: [
//         { day: "Mon", time: "9–10 AM", course: "AGR-401", room: "LT-3" },
//         { day: "Tue", time: "11–12 PM", course: "AGR-502", room: "LT-1" },
//         { day: "Wed", time: "2–3 PM", course: "AGRO-HE1", room: "Lab-2" },
//       ],
//       notifications: [
//         { type: "warning", text: "2 grade sheets awaiting submission", time: "3h ago" },
//         { type: "info", text: "Faculty meeting — Oct 30, 11 AM", time: "1d ago" },
//         { type: "success", text: "Result approved: AGR-502 Mid-Term", time: "2d ago" },
//       ],
//     },
//   });
// }

// function useHodData() {
//   return useQuery({
//     queryKey: ["hod-dashboard"],
//     queryFn: async () => (await api.get("/hod/dashboard")).data,
//     placeholderData: {
//       totalFaculty: 24,
//       totalStudents: 482,
//       pendingApprovals: 8,
//       activeOfferings: 12,
//       pendingGradeReviews: [
//         { course: "AGR-401", faculty: "Dr. A. Nair", submitted: "Oct 24, 2024", status: "Pending" },
//         { course: "PLT-302", faculty: "Dr. R. Sarma", submitted: "Oct 24, 2024", status: "Pending" },
//         { course: "AGRO-401", faculty: "Dr. J. Hussain", submitted: "Oct 24, 2024", status: "Review" },
//       ],
//       enrollmentApprovals: [
//         { student: "Simon Bansal", rollNo: "S.C. Markuss", date: "Oct 24", course: "AGR-401" },
//         { student: "Anurag Goswami", rollNo: "S.C. Markuss", date: "Oct 24", course: "AGR-502" },
//         { student: "Rehan Bora", rollNo: "Aug 24", date: "Aug 24", course: "PLT-302" },
//       ],
//       coursesOffered: [
//         { code: "AGR-301", name: "Principles of Agronomy", credits: "3+0+1", faculty: "Dr. K. Sharma", enrolled: 38, status: "Active" },
//         { code: "AGRO-401", name: "Field Management", credits: "2+1+0", faculty: "Dr. P. Gupt", enrolled: 29, status: "Active" },
//         { code: "AGROHC2", name: "Advanced Crop Physiology", credits: "1+0+1", faculty: "Dr. C. Borah", enrolled: 31, status: "Active" },
//       ],
//       calendarEvents: [
//         { date: "Oct 27", type: "deadline", title: "Internal Assessment Week", desc: "Submit marks by 5 PM" },
//         { date: "Oct 30", type: "event", title: "Faculty Meeting", desc: "Discuss semester progress" },
//         { date: "Nov 15", type: "exam", title: "Semester End Exams", desc: "Final grade submission due" },
//       ],
//       notifications: [
//         { type: "warning", text: "8 enrollment approvals pending", time: "1h ago" },
//         { type: "info", text: "Exam schedule published for Sem V", time: "4h ago" },
//         { type: "success", text: "3 grade sheets approved today", time: "6h ago" },
//       ],
//     },
//   });
// }

// // ── Shared UI Atoms ────────────────────────────────────────────────────────────
// function SectionHeader({ title, href, label = "View All" }: { title: string; href?: string; label?: string }) {
//   return (
//     <div className="flex items-center justify-between mb-3">
//       <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h2>
//       {href && (
//         <Link href={href} className="text-xs text-[#0D6E6E] font-medium flex items-center gap-1 hover:opacity-70 transition-opacity">
//           {label} <ChevronRight size={12} />
//         </Link>
//       )}
//     </div>
//   );
// }

// function StatGrid({ stats }: { stats: StatCard[] }) {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
//       {stats.map((s) => (
//         <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
//           <div className="flex items-center justify-between mb-2">
//             <s.icon size={18} className={s.textColor} />
//             {s.trend === "up" && <TrendingUp size={12} className="text-green-500" />}
//             {s.trend === "down" && <TrendingUp size={12} className="text-red-500 rotate-180" />}
//           </div>
//           <p className={`text-2xl font-bold ${s.textColor}`}>{s.value}</p>
//           <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
//           {s.sub && <p className="text-xs text-gray-400">{s.sub}</p>}
//         </div>
//       ))}
//     </div>
//   );
// }

// function NotifDot({ type }: { type: "info" | "warning" | "success" | "error" }) {
//   const map = { info: "bg-blue-500", warning: "bg-amber-500", success: "bg-green-500", error: "bg-red-500" };
//   return <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${map[type]}`} />;
// }

// function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
//   return (
//     <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
//       {children}
//     </div>
//   );
// }

// function AttendancePill({ pct }: { pct: number }) {
//   const color = pct >= 85 ? "text-green-700 bg-green-50" : pct >= 75 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50";
//   return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{pct}%</span>;
// }

// function GradeBadge({ grade }: { grade: string }) {
//   const color =
//     grade.startsWith("A") ? "text-teal-700 bg-teal-50" :
//     grade.startsWith("B") ? "text-blue-700 bg-blue-50" :
//     "text-amber-700 bg-amber-50";
//   return <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${color}`}>{grade}</span>;
// }

// function StatusBadge({ status }: { status: string }) {
//   const color = status === "Active" ? "text-green-700 bg-green-50" : status === "Pending" ? "text-amber-700 bg-amber-50" : "text-blue-700 bg-blue-50";
//   return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{status}</span>;
// }

// // ── Quick Links Sidebar strip ─────────────────────────────────────────────────
// function QuickLinksStrip({ links }: { links: QuickLink[] }) {
//   return (
//     <div className="flex flex-wrap gap-2 mb-6">
//       {links.map((l) => (
//         <Link
//           key={l.href}
//           href={l.href}
//           className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-100 shadow-sm text-sm font-medium text-gray-700 hover:border-[#0D6E6E] hover:text-[#0D6E6E] transition-all group"
//         >
//           <l.icon size={15} className="text-gray-400 group-hover:text-[#0D6E6E]" />
//           {l.label}
//           {l.badge !== undefined && (
//             <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${l.badgeColor ?? "bg-red-100 text-red-600"}`}>
//               {l.badge}
//             </span>
//           )}
//         </Link>
//       ))}
//     </div>
//   );
// }

// // ── Welcome Header ─────────────────────────────────────────────────────────────
// function RoleSwitcher() {
//   const setRole = useAuthStore((s) => s.setRole);
//   const role = useRole();
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     function onDocClick() {
//       if (open) setOpen(false);
//     }
//     document.addEventListener("click", onDocClick);
//     return () => document.removeEventListener("click", onDocClick);
//   }, [open]);

//   if (!setRole) return null;
//   const opts = [
//     { value: "hod", label: "HOD" },
//     { value: "faculty", label: "Faculty" },
//     { value: "student", label: "Student" },
//   ];

//   return (
//     <div className="relative">
//       <button
//         onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
//         className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-500 hover:text-[#0D6E6E] hover:border-[#0D6E6E] transition-all"
//         aria-label="Change role"
//       >
//         <User2 size={18} />
//       </button>
//       {open && (
//         <div onClick={(e) => e.stopPropagation()} className="absolute right-0 mt-2 w-40 bg-white p-2 border border-gray-100 rounded-xl shadow">
//           {opts.map((o) => (
//             <button
//               key={o.value}
//               type="button"
//               onClick={() => { setRole(o.value); setOpen(false); }}
//               className={`w-full text-left px-3 py-2 rounded-xl transition ${role === o.value ? "bg-[#0D6E6E]/10 text-[#0D6E6E] font-semibold" : "text-gray-700 hover:bg-gray-100"}`}
//             >
//               {o.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function WelcomeHeader({ name, role, rollId, semester, action }: { name: string; role: string; rollId?: string; semester?: string; action?: React.ReactNode }) {
//   return (
//     <div className="mb-6">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-xs font-medium text-[#0D6E6E] uppercase tracking-widest mb-1">AAU Academic Management System</p>
//           <h1 className="text-2xl font-bold text-[#0A1628]">
//             Welcome back, <span className="text-[#0D6E6E]">{name}</span> 👋
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             {role}
//             {rollId && <> &middot; <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{rollId}</span></>}
//             {semester && <> &middot; {semester}</>}
//           </p>
//         </div>
//         <div className="hidden md:flex items-center gap-2">
//           <Link href="/notifications" className="relative p-2 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-500 hover:text-[#0D6E6E] hover:border-[#0D6E6E] transition-all">
//             <Bell size={18} />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
//           </Link>
//           {action}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // STUDENT DASHBOARD
// // ══════════════════════════════════════════════════════════════════════════════
// function StudentDashboard({ user }: { user: ReturnType<typeof useUser> }) {
//   const { data: d } = useStudentData();

//   const stats: StatCard[] = [
//     { label: "CGPA", value: d?.gpa, sub: "University Avg: 7.8", trend: "up", color: "bg-[#F0F7FF]", textColor: "text-[#0A1628]", icon: Award },
//     { label: "Credits Earned", value: d?.creditsEarned, sub: "20 Credits Due", color: "bg-[#F0FDF4]", textColor: "text-green-900", icon: Target },
//     { label: "Credits Pending", value: d?.creditsPending, sub: "Current Load", color: "bg-[#FFF7ED]", textColor: "text-orange-900", icon: Clock },
//     { label: "Active Courses", value: d?.activeCourses, sub: "Semester III", trend: "neutral", color: "bg-[#F5F3FF]", textColor: "text-purple-900", icon: BookOpen },
//   ];

//   const links: QuickLink[] = [
//     { label: "Course Catalog", href: "/courses", icon: BookCopy },
//     { label: "Enrollment", href: "/enrollment", icon: ClipboardCheck },
//     { label: "Grade Sheets", href: "/grading", icon: BarChart3 },
//     { label: "Advisory", href: "/research", icon: GraduationCap },
//     { label: "Calendar", href: "/calendar", icon: CalendarDays },
//     { label: "Notifications", href: "/notifications", icon: Bell, badge: d?.notifications?.length, badgeColor: "bg-red-100 text-red-600" },
//   ];

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <WelcomeHeader
//         name={user?.full_name?.split(" ")[0] ?? "Student"}
//         role="Student"
//         rollId={user?.roll_no ?? "AAU2024PG001"}
//         semester="Semester III"
//         action={<RoleSwitcher />}
//       />
//       <QuickLinksStrip links={links} />
//       <StatGrid stats={stats} />

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//         {/* Enrolled Courses */}
//         <div className="lg:col-span-2 space-y-5">
//           <Card>
//             <SectionHeader title="My Enrolled Courses" href="/courses" />
//             <div className="space-y-3">
//               {d?.enrolledCourses?.map((c: any) => (
//                 <div key={c.code} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#F0F7FF] transition-colors">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center">
//                       <BookOpen size={15} className="text-[#0D6E6E]" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-900">{c.name}</p>
//                       <p className="text-xs text-gray-500">{c.code} &middot; {c.instructor}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs text-gray-500">Attendance</span>
//                     <AttendancePill pct={c.attendance} />
//                     <GradeBadge grade={c.grade} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Recent Grades */}
//           <Card>
//             <SectionHeader title="Recent Results" href="/grading" />
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-xs text-gray-400 border-b border-gray-100">
//                   <th className="text-left pb-2 font-medium">Course</th>
//                   <th className="text-left pb-2 font-medium">Component</th>
//                   <th className="text-center pb-2 font-medium">Marks</th>
//                   <th className="text-center pb-2 font-medium">Grade</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {d?.recentGrades?.map((g: any, i: number) => (
//                   <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
//                     <td className="py-2.5 font-mono text-xs text-[#0D6E6E]">{g.course}</td>
//                     <td className="py-2.5 text-gray-700">{g.component}</td>
//                     <td className="py-2.5 text-center font-semibold text-gray-800">{g.marks}</td>
//                     <td className="py-2.5 text-center"><GradeBadge grade={g.grade} /></td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Card>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-5">
//           {/* GPA Trend placeholder */}
//           <Card>
//             <SectionHeader title="My GPA Trend" />
//             <div className="flex flex-col gap-1.5">
//               {[{ sem: "Sem I", gpa: 7.8 }, { sem: "Sem II", gpa: 8.1 }, { sem: "Sem III", gpa: 8.42 }].map((s) => (
//                 <div key={s.sem} className="flex items-center gap-2 text-sm">
//                   <span className="text-xs text-gray-400 w-14 flex-shrink-0">{s.sem}</span>
//                   <div className="flex-1 bg-gray-100 rounded-full h-2">
//                     <div
//                       className="bg-[#0D6E6E] h-2 rounded-full transition-all"
//                       style={{ width: `${(s.gpa / 10) * 100}%` }}
//                     />
//                   </div>
//                   <span className="text-xs font-semibold text-gray-700 w-8 text-right">{s.gpa}</span>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Upcoming Exams */}
//           <Card>
//             <SectionHeader title="Upcoming Exams" href="/calendar" />
//             <div className="space-y-2.5">
//               {d?.upcomingExams?.map((e: any, i: number) => (
//                 <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50 border border-amber-100">
//                   <div className="w-10 h-10 rounded-xl bg-amber-100 flex flex-col items-center justify-center flex-shrink-0">
//                     <span className="text-xs font-bold text-amber-700">{e.date.split(" ")[1]}</span>
//                     <span className="text-[9px] text-amber-600 uppercase">{e.date.split(" ")[0]}</span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-900">{e.subject}</p>
//                     <p className="text-xs text-gray-500">{e.time} &middot; {e.room}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Notifications */}
//           <Card>
//             <SectionHeader title="Notifications" href="/notifications" />
//             <div className="space-y-2.5">
//               {d?.notifications?.map((n: any, i: number) => (
//                 <div key={i} className="flex items-start gap-2.5">
//                   <NotifDot type={n.type} />
//                   <div>
//                     <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
//                     <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // FACULTY DASHBOARD
// // ══════════════════════════════════════════════════════════════════════════════
// function FacultyDashboard({ user }: { user: ReturnType<typeof useUser> }) {
//   const { data: d } = useFacultyData();

//   const stats: StatCard[] = [
//     { label: "Courses This Sem", value: d?.coursesThisSem, color: "bg-[#F0F7FF]", textColor: "text-[#0A1628]", icon: BookOpen },
//     { label: "Total Students", value: d?.totalStudents, trend: "up", color: "bg-[#F0FDF4]", textColor: "text-green-900", icon: Users },
//     { label: "Pending Sheets", value: d?.pendingGradeSheets, color: "bg-[#FFF7ED]", textColor: "text-orange-900", icon: ClipboardList },
//     { label: "PG Advisees", value: d?.advisees, color: "bg-[#F5F3FF]", textColor: "text-purple-900", icon: GraduationCap },
//   ];

//   const links: QuickLink[] = [
//     { label: "My Courses", href: "/courses", icon: BookOpen },
//     { label: "Grade Sheets", href: "/grading", icon: BarChart3, badge: d?.pendingGradeSheets, badgeColor: "bg-orange-100 text-orange-600" },
//     { label: "Enrollment", href: "/enrollment", icon: ClipboardList, badge: d?.pendingApprovals?.length, badgeColor: "bg-red-100 text-red-600" },
//     { label: "Advisory", href: "/research", icon: GraduationCap },
//     { label: "Reports", href: "/reports", icon: FileText },
//     { label: "Calendar", href: "/calendar", icon: CalendarDays },
//   ];

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <WelcomeHeader
//         name={user?.full_name?.split(" ")[0] ?? "Faculty"}
//         role={`Faculty · ${user?.designation ?? "Asst. Professor, Agronomy"}`}
//         semester="Semester 2026–27"
//         action={<RoleSwitcher />}
//       />
//       <QuickLinksStrip links={links} />
//       <StatGrid stats={stats} />

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//         <div className="lg:col-span-2 space-y-5">
//           {/* Courses */}
//           <Card>
//             <SectionHeader title="Courses Offered This Semester" href="/courses" />
//             <div className="space-y-2">
//               {d?.courses?.map((c: any) => (
//                 <div key={c.code} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#F0F7FF] transition-colors">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center">
//                       <BookOpen size={15} className="text-[#0D6E6E]" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-900">{c.name}</p>
//                       <p className="text-xs text-gray-500">{c.code} &middot; {c.credits} Credits</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs text-gray-400">{c.students} students</span>
//                     <StatusBadge status={c.status} />
//                     <Link href={`/courses/${c.code}`} className="p-1.5 rounded-lg text-gray-400 hover:text-[#0D6E6E] hover:bg-[#0D6E6E]/10 transition-all">
//                       <ChevronRight size={14} />
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Enrollment Requests */}
//           <Card>
//             <SectionHeader title="Enrollment Approval Requests" href="/enrollment" label={`View All (${d?.pendingApprovals?.length})`} />
//             <div className="space-y-2">
//               {d?.pendingApprovals?.map((r: any, i: number) => (
//                 <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
//                       {r.student.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-900">{r.student}</p>
//                       <p className="text-xs text-gray-500">{r.course} &middot; {r.date}</p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <button className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors flex items-center gap-1">
//                       <CheckCircle2 size={12} /> Approve
//                     </button>
//                     <button className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors">
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>

//         <div className="space-y-5">
//           {/* Weekly Schedule */}
//           <Card>
//             <SectionHeader title="Weekly Schedule" href="/calendar" />
//             <div className="space-y-2">
//               {d?.upcomingSchedule?.map((s: any, i: number) => (
//                 <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
//                   <div className="w-9 h-9 rounded-xl bg-[#0D6E6E]/10 flex flex-col items-center justify-center flex-shrink-0">
//                     <span className="text-[10px] font-bold text-[#0D6E6E]">{s.day}</span>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs font-semibold text-gray-900 truncate">{s.course}</p>
//                     <p className="text-[11px] text-gray-400">{s.time} &middot; {s.room}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Notifications */}
//           <Card>
//             <SectionHeader title="Notifications" href="/notifications" />
//             <div className="space-y-2.5">
//               {d?.notifications?.map((n: any, i: number) => (
//                 <div key={i} className="flex items-start gap-2.5">
//                   <NotifDot type={n.type} />
//                   <div>
//                     <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
//                     <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Quick Actions */}
//           <Card>
//             <SectionHeader title="Quick Actions" />
//             <div className="grid grid-cols-2 gap-2">
//               {[
//                 { label: "Post Report", icon: FileText, href: "/reports/new" },
//                 { label: "Track Marks", icon: BarChart3, href: "/grading" },
//                 { label: "Message HoD", icon: Mail, href: "/messages" },
//                 { label: "Leave Request", icon: ClipboardList, href: "/leaves" },
//               ].map((a) => (
//                 <Link key={a.href} href={a.href} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-[#F0F7FF] hover:border-[#0D6E6E] border border-transparent transition-all text-center">
//                   <a.icon size={18} className="text-[#0D6E6E]" />
//                   <span className="text-xs font-medium text-gray-700">{a.label}</span>
//                 </Link>
//               ))}
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // HOD DASHBOARD
// // ══════════════════════════════════════════════════════════════════════════════
// function HodDashboard({ user }: { user: ReturnType<typeof useUser> }) {
//   const { data: d } = useHodData();

//   const stats: StatCard[] = [
//     { label: "Faculty Officers", value: d?.totalFaculty, color: "bg-[#F0F7FF]", textColor: "text-[#0A1628]", icon: Briefcase },
//     { label: "Active Students", value: d?.totalStudents, trend: "up", color: "bg-[#F0FDF4]", textColor: "text-green-900", icon: Users },
//     { label: "Grade Sheets Pending", value: d?.pendingApprovals, color: "bg-[#FFF7ED]", textColor: "text-orange-900", icon: ClipboardList },
//     { label: "Pending Approvals", value: d?.pendingApprovals, color: "bg-[#FFF1F2]", textColor: "text-red-900", icon: AlertCircle },
//   ];

//   const links: QuickLink[] = [
//     { label: "Course Offering", href: "/courses", icon: BookOpen },
//     { label: "Enrollment", href: "/enrollment", icon: ClipboardCheck, badge: d?.enrollmentApprovals?.length, badgeColor: "bg-red-100 text-red-600" },
//     { label: "Grade Sheets", href: "/grading", icon: BarChart3, badge: d?.pendingGradeReviews?.length, badgeColor: "bg-orange-100 text-orange-600" },
//     { label: "Faculty", href: "/faculty", icon: Users },
//     { label: "Students", href: "/students", icon: GraduationCap },
//     { label: "Advisory Committees", href: "/research", icon: School },
//     { label: "Reports", href: "/reports", icon: FileText },
//     { label: "Calendar", href: "/calendar", icon: CalendarDays },
//   ];

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <WelcomeHeader
//         name={user?.full_name?.split(" ")[0] ?? "HOD"}
//         role={`Head of Department · ${user?.department ?? "Agronomy"}`}
//         semester="Academic Year 2026–27"
//         action={<RoleSwitcher />}
//       />
//       <QuickLinksStrip links={links} />
//       <StatGrid stats={stats} />

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//         <div className="lg:col-span-2 space-y-5">
//           {/* Grade Sheet Reviews */}
//           <Card>
//             <SectionHeader title="Pending Grade Sheet Reviews" href="/grading" label="View All" />
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-xs text-gray-400 border-b border-gray-100">
//                   <th className="text-left pb-2 font-medium">Course Code</th>
//                   <th className="text-left pb-2 font-medium">Instructor</th>
//                   <th className="text-left pb-2 font-medium">Submitted</th>
//                   <th className="text-center pb-2 font-medium">Status</th>
//                   <th className="text-center pb-2 font-medium">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {d?.pendingGradeReviews?.map((g: any, i: number) => (
//                   <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
//                     <td className="py-2.5 font-mono text-xs text-[#0D6E6E]">{g.course}</td>
//                     <td className="py-2.5 text-gray-700">{g.faculty}</td>
//                     <td className="py-2.5 text-xs text-gray-500">{g.submitted}</td>
//                     <td className="py-2.5 text-center"><StatusBadge status={g.status} /></td>
//                     <td className="py-2.5 text-center">
//                       <Link href={`/grading/${g.course}`} className="text-xs text-[#0D6E6E] hover:underline font-medium">Review →</Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </Card>

//           {/* Courses Offered */}
//           <Card>
//             <SectionHeader title="Courses Offered This Semester" href="/courses" />
//             <div className="space-y-2">
//               {d?.coursesOffered?.map((c: any) => (
//                 <div key={c.code} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#F0F7FF] transition-colors">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center">
//                       <BookOpen size={15} className="text-[#0D6E6E]" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-900">{c.name}</p>
//                       <p className="text-xs text-gray-500">{c.code} &middot; {c.faculty} &middot; {c.credits} cr</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <div className="flex flex-col items-end">
//                       <span className="text-xs font-semibold text-gray-800">{c.enrolled}</span>
//                       <span className="text-[10px] text-gray-400">enrolled</span>
//                     </div>
//                     <StatusBadge status={c.status} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>

//         <div className="space-y-5">
//           {/* Enrollment Approvals */}
//           <Card>
//             <SectionHeader title="Enrollment Approvals" href="/enrollment" label={`View All (${d?.enrollmentApprovals?.length})`} />
//             <div className="space-y-2">
//               {d?.enrollmentApprovals?.map((r: any, i: number) => (
//                 <div key={i} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
//                   <div className="flex items-center justify-between mb-1.5">
//                     <p className="text-xs font-semibold text-gray-900">{r.student}</p>
//                     <span className="text-[10px] text-gray-400">{r.date}</span>
//                   </div>
//                   <p className="text-[11px] text-gray-500 mb-2">{r.course}</p>
//                   <div className="flex gap-1.5">
//                     <button className="flex-1 text-[11px] py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors">✓ Approve</button>
//                     <button className="flex-1 text-[11px] py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors">✕ Reject</button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Academic Calendar */}
//           <Card>
//             <SectionHeader title="Academic Calendar" href="/calendar" />
//             <div className="space-y-2">
//               {d?.calendarEvents?.map((e: any, i: number) => {
//                 const typeColor = e.type === "deadline"
//                   ? "bg-red-50 border-red-100 text-red-700"
//                   : e.type === "exam"
//                   ? "bg-amber-50 border-amber-100 text-amber-700"
//                   : "bg-blue-50 border-blue-100 text-blue-700";
//                 return (
//                   <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${typeColor}`}>
//                     <div className="text-xs font-bold flex-shrink-0 w-8 text-center">{e.date.split(" ")[1]}<br /><span className="font-normal">{e.date.split(" ")[0]}</span></div>
//                     <div>
//                       <p className="text-xs font-semibold">{e.title}</p>
//                       <p className="text-[11px] opacity-80">{e.desc}</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </Card>

//           {/* Notifications */}
//           <Card>
//             <SectionHeader title="Notifications" href="/notifications" />
//             <div className="space-y-2.5">
//               {d?.notifications?.map((n: any, i: number) => (
//                 <div key={i} className="flex items-start gap-2.5">
//                   <NotifDot type={n.type} />
//                   <div>
//                     <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
//                     <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Quick Admin Actions */}
//           <Card>
//             <SectionHeader title="Quick Admin Actions" />
//             <div className="grid grid-cols-2 gap-2">
//               {[
//                 { label: "Allocate Instructors", icon: UserCheck, href: "/faculty/allocate" },
//                 { label: "Post Reports", icon: FileText, href: "/reports/new" },
//                 { label: "Track Entries", icon: Activity, href: "/attendance" },
//                 { label: "Blast Message", icon: Mail, href: "/messages/broadcast" },
//               ].map((a) => (
//                 <Link key={a.href} href={a.href} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-[#F0F7FF] border border-transparent hover:border-[#0D6E6E] transition-all text-center">
//                   <a.icon size={18} className="text-[#0D6E6E]" />
//                   <span className="text-xs font-medium text-gray-700">{a.label}</span>
//                 </Link>
//               ))}
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════════════════
// // ROOT: Role Router
// // ══════════════════════════════════════════════════════════════════════════════
// export default function DashboardPage() {
//   const user = useUser();
//   const role = useRole();

//   // Route to appropriate dashboard based on role
//   const content = role === "student" ? <StudentDashboard user={user} /> :
//     role === "faculty" ? <FacultyDashboard user={user} /> :
//     <HodDashboard user={user} />;

//   return <>{content}</>;
// }


"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUser, useRole, useAuthStore } from "@/stores/auth.store";
import { ROLES } from "@/lib/utils";
import {
  GraduationCap, BookOpen, Users, CalendarDays, ClipboardList,
  BarChart3, Bell, TrendingUp, CheckCircle2, Clock, AlertCircle,
  BookMarked, FileText, UserCheck, Layers, ChevronRight,
  Award, Target, Activity, Briefcase, User2, Mail,
  Percent, BookCopy, ClipboardCheck, School, Building2,
  Filter, PenSquare, Eye, Rss, ArrowUpRight, CircleDot,
} from "lucide-react";
import Link from "next/link";

// ── Brand colors (from screenshots) ──────────────────────────────────────────
// Primary navy:    #0A1628
// Accent teal:     #0D6E6E  (sidebar active, borders)
// Card blue:       #1E40AF  (info badges)
// Soft bg:         #F0F4FF
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────
interface StatCard {
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  color: string;
  textColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  critical?: boolean;
}

interface QuickLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
  badgeColor?: string;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useStudentData() {
  return useQuery({
    queryKey: ["student-dashboard"],
    queryFn: async () => (await api.get("/student/dashboard")).data,
    placeholderData: {
      gpa: "8.42",
      creditsEarned: 54,
      creditsPending: 18,
      activeCourses: 6,
      attendance: 88,
      enrolledCourses: [
        { code: "AGR-502", name: "Advanced Agronomy", instructor: "Dr. T. Barak", attendance: 92, grade: "A" },
        { code: "PLT-502", name: "Plant Pathology", instructor: "Dr. R. Mehta", attendance: 88, grade: "B+" },
        { code: "SBC-503", name: "Crop Management", instructor: "Dr. C. Borah", attendance: 79, grade: "A-" },
      ],
      upcomingExams: [
        { subject: "Plant Pathology", date: "Jun 04", time: "10:00 AM", room: "Hall A" },
        { subject: "Term Assessment", date: "Jun 10", time: "02:00 PM", room: "Hall B" },
      ],
      recentGrades: [
        { course: "AGR-502", component: "Mid-Term Exam", marks: "42/50", grade: "A" },
        { course: "PLT-502", component: "Lab Assignment", marks: "18/20", grade: "A+" },
        { course: "SBC-503", component: "Quiz 2", marks: "08/10", grade: "B+" },
      ],
      notifications: [
        { type: "info", text: "Registration open for Sem IV — deadline Oct 28", time: "2h ago" },
        { type: "warning", text: "Fee payment due by Nov 4", time: "5h ago" },
        { type: "success", text: "Grade published: AGR-502 Mid-Term", time: "1d ago" },
      ],
    },
  });
}

function useFacultyData() {
  return useQuery({
    queryKey: ["faculty-dashboard"],
    queryFn: async () => (await api.get("/faculty/dashboard")).data,
    placeholderData: {
      coursesThisSem: 4,
      totalStudents: 142,
      pendingGradeSheets: 2,
      advisees: 7,
      courses: [
        { code: "AGR-401", name: "Principles of Agronomy", students: 38, credits: "3+0+1", status: "Active" },
        { code: "AGR-502", name: "Advanced Agronomy", students: 28, credits: "3+0+1", status: "Active" },
        { code: "AGRO-HE1", name: "Advanced Crop Physiology", students: 41, credits: "1+0+1", status: "Active" },
        { code: "AGR-601", name: "Weed Management", students: 35, credits: "2+0+1", status: "Active" },
      ],
      pendingApprovals: [
        { student: "Simran Bansal", rollNo: "S.C. Markuss", date: "Oct 24, 2024", course: "AGR-401" },
        { student: "Anurag Goswami", rollNo: "S.C. Markuss", date: "Oct 24, 2024", course: "AGR-502" },
      ],
      upcomingSchedule: [
        { day: "Mon", time: "9–10 AM", course: "AGR-401", room: "LT-3" },
        { day: "Tue", time: "11–12 PM", course: "AGR-502", room: "LT-1" },
        { day: "Wed", time: "2–3 PM", course: "AGRO-HE1", room: "Lab-2" },
      ],
      notifications: [
        { type: "warning", text: "2 grade sheets awaiting submission", time: "3h ago" },
        { type: "info", text: "Faculty meeting — Oct 30, 11 AM", time: "1d ago" },
        { type: "success", text: "Result approved: AGR-502 Mid-Term", time: "2d ago" },
      ],
    },
  });
}

function useHodData() {
  return useQuery({
    queryKey: ["hod-dashboard"],
    queryFn: async () => (await api.get("/hod/dashboard")).data,
    placeholderData: {
      totalFaculty: 24,
      totalStudents: 482,
      pendingApprovals: 8,
      activeOfferings: 12,
      pendingGradeReviews: [
        { course: "AGR-401", faculty: "Dr. A. Nair", submitted: "Oct 24, 2024", status: "Pending" },
        { course: "PLT-302", faculty: "Dr. R. Sarma", submitted: "Oct 24, 2024", status: "Pending" },
        { course: "AGRO-401", faculty: "Dr. J. Hussain", submitted: "Oct 24, 2024", status: "Review" },
      ],
      enrollmentApprovals: [
        { student: "Simon Bansal", rollNo: "S.C. Markuss", date: "Oct 24", course: "AGR-401" },
        { student: "Anurag Goswami", rollNo: "S.C. Markuss", date: "Oct 24", course: "AGR-502" },
        { student: "Rehan Bora", rollNo: "Aug 24", date: "Aug 24", course: "PLT-302" },
      ],
      coursesOffered: [
        { code: "AGR-301", name: "Principles of Agronomy", credits: "3+0+1", faculty: "Dr. K. Sharma", enrolled: 38, status: "Active" },
        { code: "AGRO-401", name: "Field Management", credits: "2+1+0", faculty: "Dr. P. Gupt", enrolled: 29, status: "Active" },
        { code: "AGROHC2", name: "Advanced Crop Physiology", credits: "1+0+1", faculty: "Dr. C. Borah", enrolled: 31, status: "Active" },
      ],
      calendarEvents: [
        { date: "Oct 27", type: "deadline", title: "Internal Assessment Week", desc: "Submit marks by 5 PM" },
        { date: "Oct 30", type: "event", title: "Faculty Meeting", desc: "Discuss semester progress" },
        { date: "Nov 15", type: "exam", title: "Semester End Exams", desc: "Final grade submission due" },
      ],
      notifications: [
        { type: "warning", text: "8 enrollment approvals pending", time: "1h ago" },
        { type: "info", text: "Exam schedule published for Sem V", time: "4h ago" },
        { type: "success", text: "3 grade sheets approved today", time: "6h ago" },
      ],
    },
  });
}

function useAcademicCellData() {
  return useQuery({
    queryKey: ["academic-cell-dashboard"],
    queryFn: async () => (await api.get("/academic-cell/dashboard")).data,
    placeholderData: {
      totalDepts: 18,
      newDepts: 2,
      totalCourses: 142,
      pendingHodReviews: 12,
      pendingCellApprovals: 24,
      resultsPublished: 68,
      approvalQueue: [
        {
          sheetId: "GS-2026-001",
          dept: "Agronomy",
          course: "AGR-501: Principles of Crop Production",
          hodStatus: "APPROVED",
          actionRequired: "Verify Internal Assessment",
          cellStatus: "pending",
        },
        {
          sheetId: "GS-2026-042",
          dept: "Soil Science",
          course: "SSC-505: Soil Chemistry",
          hodStatus: "APPROVED",
          actionRequired: "Final Cell Concurrence",
          cellStatus: "pending",
        },
        {
          sheetId: "GS-2026-055",
          dept: "Entomology",
          course: "ENT-510: Pest Management",
          hodStatus: "PENDING",
          actionRequired: "Waiting for HOD",
          cellStatus: "waiting",
        },
        {
          sheetId: "GS-2026-071",
          dept: "Horticulture",
          course: "HRT-402: Post-Harvest Technology",
          hodStatus: "APPROVED",
          actionRequired: "Review & Sign",
          cellStatus: "pending",
        },
      ],
      deptProgress: [
        { name: "Horticulture", pct: 68 },
        { name: "Plant Pathology", pct: 42 },
        { name: "Agricultural Economics", pct: 12 },
        { name: "Biotechnology", pct: 18 },
        { name: "Agronomy", pct: 55 },
        { name: "Soil Science", pct: 30 },
      ],
      activityFeed: [
        { actor: "Dr. Sharma (HOD)", action: "approved Grade Sheet #GS-2026-042", time: "10 mins ago", type: "success" },
        { actor: "System", action: "generated Semester Summary Report for Agronomy", time: "1 hour ago", type: "info" },
        { actor: "Admin", action: "updated the Academic Calendar for Phase B", time: "3 hours ago", type: "info" },
        { actor: "Prof. Baruah", action: "submitted results for SSC-501", time: "Yesterday", type: "success" },
      ],
    },
  });
}

// ── Shared UI Atoms ────────────────────────────────────────────────────────────
function SectionHeader({ title, href, label = "View All", action }: { title: string; href?: string; label?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h2>
      <div className="flex items-center gap-2">
        {action}
        {href && (
          <Link href={href} className="text-xs text-[#0D6E6E] font-medium flex items-center gap-1 hover:opacity-70 transition-opacity">
            {label} <ChevronRight size={12} />
          </Link>
        )}
      </div>
    </div>
  );
}

function StatGrid({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className={`rounded-xl p-4 ${s.color} relative overflow-hidden`}>
          {s.critical && (
            <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500 text-white uppercase tracking-wider">Critical</span>
          )}
          <div className="flex items-center justify-between mb-2">
            <s.icon size={18} className={s.textColor} />
            {s.trend === "up" && <TrendingUp size={12} className="text-green-500" />}
            {s.trend === "down" && <TrendingUp size={12} className="text-red-500 rotate-180" />}
          </div>
          <p className={`text-2xl font-bold ${s.textColor}`}>{s.value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          {s.sub && <p className="text-xs text-gray-400">{s.sub}</p>}
        </div>
      ))}
    </div>
  );
}

function NotifDot({ type }: { type: "info" | "warning" | "success" | "error" }) {
  const map = { info: "bg-blue-500", warning: "bg-amber-500", success: "bg-green-500", error: "bg-red-500" };
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${map[type]}`} />;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

function AttendancePill({ pct }: { pct: number }) {
  const color = pct >= 85 ? "text-green-700 bg-green-50" : pct >= 75 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50";
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{pct}%</span>;
}

function GradeBadge({ grade }: { grade: string }) {
  const color =
    grade.startsWith("A") ? "text-teal-700 bg-teal-50" :
    grade.startsWith("B") ? "text-blue-700 bg-blue-50" :
    "text-amber-700 bg-amber-50";
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${color}`}>{grade}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Active" || status === "APPROVED" ? "text-green-700 bg-green-50" :
    status === "Pending" || status === "PENDING" ? "text-amber-700 bg-amber-50" :
    status === "Review" ? "text-blue-700 bg-blue-50" :
    "text-gray-700 bg-gray-100";
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>{status}</span>;
}

// ── Quick Links Sidebar strip ─────────────────────────────────────────────────
function QuickLinksStrip({ links }: { links: QuickLink[] }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-100 shadow-sm text-sm font-medium text-gray-700 hover:border-[#0D6E6E] hover:text-[#0D6E6E] transition-all group"
        >
          <l.icon size={15} className="text-gray-400 group-hover:text-[#0D6E6E]" />
          {l.label}
          {l.badge !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${l.badgeColor ?? "bg-red-100 text-red-600"}`}>
              {l.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

// ── Role Switcher ──────────────────────────────────────────────────────────────
function RoleSwitcher() {
  const setRole = useAuthStore((s) => s.setRole);
  const role = useRole();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onDocClick() {
      if (open) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  if (!setRole) return null;

  const opts = [
    { value: "hod", label: "HOD" },
    { value: "faculty", label: "Faculty" },
    { value: "student", label: "Student" },
    { value: "academic_cell", label: "Academic Cell" },
  ];

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-500 hover:text-[#0D6E6E] hover:border-[#0D6E6E] transition-all"
        aria-label="Change role"
      >
        <User2 size={18} />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-44 bg-white p-2 border border-gray-100 rounded-xl shadow-lg z-50"
        >
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 pt-1 pb-2">Switch Role</p>
          {opts.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { setRole(o.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${
                role === o.value
                  ? "bg-[#0D6E6E]/10 text-[#0D6E6E] font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Welcome Header ─────────────────────────────────────────────────────────────
function WelcomeHeader({
  name, role, rollId, semester, action,
}: {
  name: string;
  role: string;
  rollId?: string;
  semester?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#0D6E6E] uppercase tracking-widest mb-1">AAU Academic Management System</p>
          <h1 className="text-2xl font-bold text-[#0A1628]">
            Welcome back, <span className="text-[#0D6E6E]">{name}</span> 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {role}
            {rollId && <> &middot; <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{rollId}</span></>}
            {semester && <> &middot; {semester}</>}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/notifications" className="relative p-2 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-500 hover:text-[#0D6E6E] hover:border-[#0D6E6E] transition-all">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
          {action}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function StudentDashboard({ user }: { user: ReturnType<typeof useUser> }) {
  const { data: d } = useStudentData();

  const stats: StatCard[] = [
    { label: "CGPA", value: d?.gpa, sub: "University Avg: 7.8", trend: "up", color: "bg-[#F0F7FF]", textColor: "text-[#0A1628]", icon: Award },
    { label: "Credits Earned", value: d?.creditsEarned, sub: "20 Credits Due", color: "bg-[#F0FDF4]", textColor: "text-green-900", icon: Target },
    { label: "Credits Pending", value: d?.creditsPending, sub: "Current Load", color: "bg-[#FFF7ED]", textColor: "text-orange-900", icon: Clock },
    { label: "Active Courses", value: d?.activeCourses, sub: "Semester III", trend: "neutral", color: "bg-[#F5F3FF]", textColor: "text-purple-900", icon: BookOpen },
  ];

  const links: QuickLink[] = [
    { label: "Course Catalog", href: "/courses", icon: BookCopy },
    { label: "Enrollment", href: "/enrollment", icon: ClipboardCheck },
    { label: "Grade Sheets", href: "/grading", icon: BarChart3 },
    { label: "Advisory", href: "/research", icon: GraduationCap },
    { label: "Calendar", href: "/calendar", icon: CalendarDays },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: d?.notifications?.length, badgeColor: "bg-red-100 text-red-600" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <WelcomeHeader
        name={user?.full_name?.split(" ")[0] ?? "Student"}
        role="Student"
        rollId={user?.roll_no ?? "AAU2024PG001"}
        semester="Semester III"
        action={<RoleSwitcher />}
      />
      <QuickLinksStrip links={links} />
      <StatGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <SectionHeader title="My Enrolled Courses" href="/courses" />
            <div className="space-y-3">
              {d?.enrolledCourses?.map((c: any) => (
                <div key={c.code} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#F0F7FF] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center">
                      <BookOpen size={15} className="text-[#0D6E6E]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.code} &middot; {c.instructor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Attendance</span>
                    <AttendancePill pct={c.attendance} />
                    <GradeBadge grade={c.grade} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Recent Results" href="/grading" />
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Course</th>
                  <th className="text-left pb-2 font-medium">Component</th>
                  <th className="text-center pb-2 font-medium">Marks</th>
                  <th className="text-center pb-2 font-medium">Grade</th>
                </tr>
              </thead>
              <tbody>
                {d?.recentGrades?.map((g: any, i: number) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-mono text-xs text-[#0D6E6E]">{g.course}</td>
                    <td className="py-2.5 text-gray-700">{g.component}</td>
                    <td className="py-2.5 text-center font-semibold text-gray-800">{g.marks}</td>
                    <td className="py-2.5 text-center"><GradeBadge grade={g.grade} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <SectionHeader title="My GPA Trend" />
            <div className="flex flex-col gap-1.5">
              {[{ sem: "Sem I", gpa: 7.8 }, { sem: "Sem II", gpa: 8.1 }, { sem: "Sem III", gpa: 8.42 }].map((s) => (
                <div key={s.sem} className="flex items-center gap-2 text-sm">
                  <span className="text-xs text-gray-400 w-14 flex-shrink-0">{s.sem}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-[#0D6E6E] h-2 rounded-full transition-all" style={{ width: `${(s.gpa / 10) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">{s.gpa}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Upcoming Exams" href="/calendar" />
            <div className="space-y-2.5">
              {d?.upcomingExams?.map((e: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-amber-700">{e.date.split(" ")[1]}</span>
                    <span className="text-[9px] text-amber-600 uppercase">{e.date.split(" ")[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{e.subject}</p>
                    <p className="text-xs text-gray-500">{e.time} &middot; {e.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Notifications" href="/notifications" />
            <div className="space-y-2.5">
              {d?.notifications?.map((n: any, i: number) => (
                <div key={i} className="flex items-start gap-2.5">
                  <NotifDot type={n.type} />
                  <div>
                    <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FACULTY DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function FacultyDashboard({ user }: { user: ReturnType<typeof useUser> }) {
  const { data: d } = useFacultyData();

  const stats: StatCard[] = [
    { label: "Courses This Sem", value: d?.coursesThisSem, color: "bg-[#F0F7FF]", textColor: "text-[#0A1628]", icon: BookOpen },
    { label: "Total Students", value: d?.totalStudents, trend: "up", color: "bg-[#F0FDF4]", textColor: "text-green-900", icon: Users },
    { label: "Pending Sheets", value: d?.pendingGradeSheets, color: "bg-[#FFF7ED]", textColor: "text-orange-900", icon: ClipboardList },
    { label: "PG Advisees", value: d?.advisees, color: "bg-[#F5F3FF]", textColor: "text-purple-900", icon: GraduationCap },
  ];

  const links: QuickLink[] = [
    { label: "My Courses", href: "/courses", icon: BookOpen },
    { label: "Grade Sheets", href: "/grading", icon: BarChart3, badge: d?.pendingGradeSheets, badgeColor: "bg-orange-100 text-orange-600" },
    { label: "Enrollment", href: "/enrollment", icon: ClipboardList, badge: d?.pendingApprovals?.length, badgeColor: "bg-red-100 text-red-600" },
    { label: "Advisory", href: "/research", icon: GraduationCap },
    { label: "Reports", href: "/reports", icon: FileText },
    { label: "Calendar", href: "/calendar", icon: CalendarDays },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <WelcomeHeader
        name={user?.full_name?.split(" ")[0] ?? "Faculty"}
        role={`Faculty · ${user?.designation ?? "Asst. Professor, Agronomy"}`}
        semester="Semester 2026–27"
        action={<RoleSwitcher />}
      />
      <QuickLinksStrip links={links} />
      <StatGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <SectionHeader title="Courses Offered This Semester" href="/courses" />
            <div className="space-y-2">
              {d?.courses?.map((c: any) => (
                <div key={c.code} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#F0F7FF] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center">
                      <BookOpen size={15} className="text-[#0D6E6E]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.code} &middot; {c.credits} Credits</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{c.students} students</span>
                    <StatusBadge status={c.status} />
                    <Link href={`/courses/${c.code}`} className="p-1.5 rounded-lg text-gray-400 hover:text-[#0D6E6E] hover:bg-[#0D6E6E]/10 transition-all">
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Enrollment Approval Requests" href="/enrollment" label={`View All (${d?.pendingApprovals?.length})`} />
            <div className="space-y-2">
              {d?.pendingApprovals?.map((r: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                      {r.student.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.student}</p>
                      <p className="text-xs text-gray-500">{r.course} &middot; {r.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors flex items-center gap-1">
                      <CheckCircle2 size={12} /> Approve
                    </button>
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <SectionHeader title="Weekly Schedule" href="/calendar" />
            <div className="space-y-2">
              {d?.upcomingSchedule?.map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
                  <div className="w-9 h-9 rounded-xl bg-[#0D6E6E]/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-[#0D6E6E]">{s.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{s.course}</p>
                    <p className="text-[11px] text-gray-400">{s.time} &middot; {s.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Notifications" href="/notifications" />
            <div className="space-y-2.5">
              {d?.notifications?.map((n: any, i: number) => (
                <div key={i} className="flex items-start gap-2.5">
                  <NotifDot type={n.type} />
                  <div>
                    <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Post Report", icon: FileText, href: "/reports/new" },
                { label: "Track Marks", icon: BarChart3, href: "/grading" },
                { label: "Message HoD", icon: Mail, href: "/messages" },
                { label: "Leave Request", icon: ClipboardList, href: "/leaves" },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-[#F0F7FF] hover:border-[#0D6E6E] border border-transparent transition-all text-center">
                  <a.icon size={18} className="text-[#0D6E6E]" />
                  <span className="text-xs font-medium text-gray-700">{a.label}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOD DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function HodDashboard({ user }: { user: ReturnType<typeof useUser> }) {
  const { data: d } = useHodData();

  const stats: StatCard[] = [
    { label: "Faculty Officers", value: d?.totalFaculty, color: "bg-[#F0F7FF]", textColor: "text-[#0A1628]", icon: Briefcase },
    { label: "Active Students", value: d?.totalStudents, trend: "up", color: "bg-[#F0FDF4]", textColor: "text-green-900", icon: Users },
    { label: "Grade Sheets Pending", value: d?.pendingApprovals, color: "bg-[#FFF7ED]", textColor: "text-orange-900", icon: ClipboardList },
    { label: "Pending Approvals", value: d?.pendingApprovals, color: "bg-[#FFF1F2]", textColor: "text-red-900", icon: AlertCircle },
  ];

  const links: QuickLink[] = [
    { label: "Course Offering", href: "/courses", icon: BookOpen },
    { label: "Enrollment", href: "/enrollment", icon: ClipboardCheck, badge: d?.enrollmentApprovals?.length, badgeColor: "bg-red-100 text-red-600" },
    { label: "Grade Sheets", href: "/grading", icon: BarChart3, badge: d?.pendingGradeReviews?.length, badgeColor: "bg-orange-100 text-orange-600" },
    { label: "Faculty", href: "/faculty", icon: Users },
    { label: "Students", href: "/students", icon: GraduationCap },
    { label: "Advisory Committees", href: "/research", icon: School },
    { label: "Reports", href: "/reports", icon: FileText },
    { label: "Calendar", href: "/calendar", icon: CalendarDays },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <WelcomeHeader
        name={user?.full_name?.split(" ")[0] ?? "HOD"}
        role={`Head of Department · ${user?.department ?? "Agronomy"}`}
        semester="Academic Year 2026–27"
        action={<RoleSwitcher />}
      />
      <QuickLinksStrip links={links} />
      <StatGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <SectionHeader title="Pending Grade Sheet Reviews" href="/grading" label="View All" />
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Course Code</th>
                  <th className="text-left pb-2 font-medium">Instructor</th>
                  <th className="text-left pb-2 font-medium">Submitted</th>
                  <th className="text-center pb-2 font-medium">Status</th>
                  <th className="text-center pb-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {d?.pendingGradeReviews?.map((g: any, i: number) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-mono text-xs text-[#0D6E6E]">{g.course}</td>
                    <td className="py-2.5 text-gray-700">{g.faculty}</td>
                    <td className="py-2.5 text-xs text-gray-500">{g.submitted}</td>
                    <td className="py-2.5 text-center"><StatusBadge status={g.status} /></td>
                    <td className="py-2.5 text-center">
                      <Link href={`/grading/${g.course}`} className="text-xs text-[#0D6E6E] hover:underline font-medium">Review →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <SectionHeader title="Courses Offered This Semester" href="/courses" />
            <div className="space-y-2">
              {d?.coursesOffered?.map((c: any) => (
                <div key={c.code} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[#F0F7FF] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0D6E6E]/10 flex items-center justify-center">
                      <BookOpen size={15} className="text-[#0D6E6E]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.code} &middot; {c.faculty} &middot; {c.credits} cr</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold text-gray-800">{c.enrolled}</span>
                      <span className="text-[10px] text-gray-400">enrolled</span>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <SectionHeader title="Enrollment Approvals" href="/enrollment" label={`View All (${d?.enrollmentApprovals?.length})`} />
            <div className="space-y-2">
              {d?.enrollmentApprovals?.map((r: any, i: number) => (
                <div key={i} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-gray-900">{r.student}</p>
                    <span className="text-[10px] text-gray-400">{r.date}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-2">{r.course}</p>
                  <div className="flex gap-1.5">
                    <button className="flex-1 text-[11px] py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors">✓ Approve</button>
                    <button className="flex-1 text-[11px] py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors">✕ Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Academic Calendar" href="/calendar" />
            <div className="space-y-2">
              {d?.calendarEvents?.map((e: any, i: number) => {
                const typeColor = e.type === "deadline"
                  ? "bg-red-50 border-red-100 text-red-700"
                  : e.type === "exam"
                  ? "bg-amber-50 border-amber-100 text-amber-700"
                  : "bg-blue-50 border-blue-100 text-blue-700";
                return (
                  <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${typeColor}`}>
                    <div className="text-xs font-bold flex-shrink-0 w-8 text-center">
                      {e.date.split(" ")[1]}<br /><span className="font-normal">{e.date.split(" ")[0]}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{e.title}</p>
                      <p className="text-[11px] opacity-80">{e.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Notifications" href="/notifications" />
            <div className="space-y-2.5">
              {d?.notifications?.map((n: any, i: number) => (
                <div key={i} className="flex items-start gap-2.5">
                  <NotifDot type={n.type} />
                  <div>
                    <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeader title="Quick Admin Actions" />
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Allocate Instructors", icon: UserCheck, href: "/faculty/allocate" },
                { label: "Post Reports", icon: FileText, href: "/reports/new" },
                { label: "Track Entries", icon: Activity, href: "/attendance" },
                { label: "Blast Message", icon: Mail, href: "/messages/broadcast" },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-[#F0F7FF] border border-transparent hover:border-[#0D6E6E] transition-all text-center">
                  <a.icon size={18} className="text-[#0D6E6E]" />
                  <span className="text-xs font-medium text-gray-700">{a.label}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ACADEMIC CELL DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function AcademicCellDashboard({ user }: { user: ReturnType<typeof useUser> }) {
  const { data: d } = useAcademicCellData();
  const [filterOpen, setFilterOpen] = useState(false);

  const stats: StatCard[] = [
    {
      label: "Total Depts",
      value: d?.totalDepts,
      sub: `+${d?.newDepts ?? 2} new`,
      color: "bg-[#F0F7FF]",
      textColor: "text-[#0A1628]",
      icon: Building2,
    },
    {
      label: "Total Courses",
      value: d?.totalCourses,
      color: "bg-[#F0FDF4]",
      textColor: "text-green-900",
      icon: BookOpen,
    },
    {
      label: "Pending HOD Reviews",
      value: d?.pendingHodReviews,
      color: "bg-[#FFF1F2]",
      textColor: "text-red-800",
      icon: ClipboardList,
      critical: true,
    },
    {
      label: "Pending Cell Approvals",
      value: d?.pendingCellApprovals,
      color: "bg-[#FFF7ED]",
      textColor: "text-orange-900",
      icon: AlertCircle,
    },
    {
      label: "Results Published",
      value: `${d?.resultsPublished ?? 68}%`,
      color: "bg-[#F0FDF4]",
      textColor: "text-green-900",
      trend: "up",
      icon: BarChart3,
    },
  ];

  const links: QuickLink[] = [
    { label: "Course Offering", href: "/courses", icon: BookOpen },
    { label: "Enrollment", href: "/enrollment", icon: ClipboardCheck },
    { label: "Grade Sheets", href: "/grading", icon: BarChart3, badge: d?.pendingHodReviews, badgeColor: "bg-red-100 text-red-600" },
    { label: "Results & Approvals", href: "/results", icon: CheckCircle2, badge: d?.pendingCellApprovals, badgeColor: "bg-orange-100 text-orange-600" },
    { label: "Thesis & PPW", href: "/thesis", icon: BookMarked },
    { label: "Advisory Committee", href: "/advisory", icon: Users },
    { label: "Calendar", href: "/calendar", icon: CalendarDays },
    { label: "Reports", href: "/reports", icon: FileText },
  ];

  // Progress bar color based on percent
  const progressColor = (pct: number) =>
    pct >= 60 ? "bg-green-500" : pct >= 30 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <WelcomeHeader
        name={user?.full_name?.split(" ")[0] ?? "Admin"}
        role="Academic Cell · Control Panel"
        semester="Semester I 2026–27"
        action={<RoleSwitcher />}
      />
      <QuickLinksStrip links={links} />

      {/* Stat grid — 5 cards, wraps to 2+3 on md */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color} relative overflow-hidden`}>
            {s.critical && (
              <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500 text-white uppercase tracking-wider">
                Critical
              </span>
            )}
            <div className="flex items-center justify-between mb-2">
              <s.icon size={18} className={s.textColor} />
              {s.trend === "up" && <TrendingUp size={12} className="text-green-500" />}
            </div>
            <p className={`text-2xl font-bold ${s.textColor}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            {s.sub && <p className="text-xs text-green-600 font-medium">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left / main — Approval Queue */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <SectionHeader
              title="Approval Queue"
              href="/grading"
              label="View All"
              action={
                <button
                  onClick={() => setFilterOpen((v) => !v)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0D6E6E] border border-gray-200 hover:border-[#0D6E6E] px-2.5 py-1 rounded-lg transition-all"
                >
                  <Filter size={12} /> Filter Queue
                </button>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left pb-2.5 font-medium">Sheet ID</th>
                    <th className="text-left pb-2.5 font-medium">Dept</th>
                    <th className="text-left pb-2.5 font-medium">Course</th>
                    <th className="text-center pb-2.5 font-medium">HOD Status</th>
                    <th className="text-left pb-2.5 font-medium">Action Required</th>
                    <th className="text-center pb-2.5 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {d?.approvalQueue?.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 group">
                      <td className="py-3 font-mono text-xs text-[#0D6E6E] whitespace-nowrap">{row.sheetId}</td>
                      <td className="py-3 text-xs text-gray-600 whitespace-nowrap">{row.dept}</td>
                      <td className="py-3 text-xs text-gray-800 max-w-[160px] truncate">{row.course}</td>
                      <td className="py-3 text-center">
                        <StatusBadge status={row.hodStatus} />
                      </td>
                      <td className="py-3 text-xs text-gray-500 whitespace-nowrap">{row.actionRequired}</td>
                      <td className="py-3 text-center">
                        {row.cellStatus === "waiting" ? (
                          <Link
                            href={`/grading/${row.sheetId}`}
                            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 font-medium"
                          >
                            View Details
                          </Link>
                        ) : (
                          <Link
                            href={`/grading/${row.sheetId}/review`}
                            className="text-xs px-3 py-1.5 rounded-lg bg-[#0D6E6E] text-white font-medium hover:bg-[#0b5c5c] transition-colors inline-flex items-center gap-1"
                          >
                            <PenSquare size={11} /> Review & Sign
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Department Progress Overview */}
          <Card>
            <SectionHeader title="Department Progress Overview" href="/reports" />
            <div className="space-y-3">
              {d?.deptProgress?.map((dept: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-40 flex-shrink-0 truncate">{dept.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${progressColor(dept.pct)}`}
                      style={{ width: `${dept.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-16 text-right">{dept.pct}% Complete</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Recent Activity Feed */}
          <Card>
            <SectionHeader title="Recent Activity Feed" href="/activity" label="View All Activity" />
            <div className="space-y-3">
              {d?.activityFeed?.map((a: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    a.type === "success" ? "bg-green-100" : "bg-blue-100"
                  }`}>
                    {a.type === "success"
                      ? <CheckCircle2 size={13} className="text-green-600" />
                      : <CircleDot size={13} className="text-blue-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-800 leading-relaxed">
                      <span className="font-semibold">{a.actor}</span> {a.action}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Link href="/activity" className="text-xs text-[#0D6E6E] font-medium flex items-center gap-1 hover:opacity-70 transition-opacity">
                View All Activity <ChevronRight size={12} />
              </Link>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <SectionHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "ID Card", icon: UserCheck, href: "/id-card" },
                { label: "Fee Receipt", icon: FileText, href: "/fees/receipt" },
                { label: "Admit Card", icon: ClipboardCheck, href: "/admit-card" },
                { label: "Leave Request", icon: CalendarDays, href: "/leaves" },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-[#F0F7FF] border border-transparent hover:border-[#0D6E6E] transition-all text-center"
                >
                  <a.icon size={18} className="text-[#0D6E6E]" />
                  <span className="text-xs font-medium text-gray-700">{a.label}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Cell Announcements / Notifications */}
          <Card>
            <SectionHeader title="Cell Notifications" href="/notifications" />
            <div className="space-y-2.5">
              {[
                { type: "warning" as const, text: "12 HOD-pending sheets are overdue by >3 days", time: "Just now" },
                { type: "info" as const, text: "Semester I result window closes Nov 20", time: "2h ago" },
                { type: "success" as const, text: "Agronomy dept results fully published", time: "4h ago" },
                { type: "info" as const, text: "New circular: Thesis submission format updated", time: "1d ago" },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <NotifDot type={n.type} />
                  <div>
                    <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT: Role Router
// ══════════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const user = useUser();
  const role = useRole();

  const content =
    role === "student"         ? <StudentDashboard user={user} />      :
    role === "faculty"         ? <FacultyDashboard user={user} />      :
    role === "hod"             ? <HodDashboard user={user} />          :
    role === "academic_cell"   ? <AcademicCellDashboard user={user} /> :
    role === "academic_admin"  ? <AcademicCellDashboard user={user} /> :
    role === "super_admin"     ? <AcademicCellDashboard user={user} /> :
    (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name?.split(" ")[0]}!</h1>
          <p className="text-gray-500 mt-1">{ROLES[role as keyof typeof ROLES] ?? role} · AAU Academic Management System</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-700 text-sm">
          <AlertCircle size={16} className="inline mr-2" />
          Dashboard view not configured for your role. Please contact the system administrator.
        </div>
      </div>
    );

  return <>{content}</>;
}