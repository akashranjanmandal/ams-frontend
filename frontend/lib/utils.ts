import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string, style: "long" | "short" | "relative" = "long"): string {
  const d = new Date(iso);
  const opts: Intl.DateTimeFormatOptions = { timeZone: "Asia/Kolkata" };
  if (style === "relative") {
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return Math.floor(hrs / 24) + "d ago";
  }
  if (style === "short") {
    return d.toLocaleDateString("en-IN", { ...opts, day: "2-digit", month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("en-IN", { ...opts, day: "2-digit", month: "long", year: "numeric" });
}

export const ROLES = {
  super_admin: "Super Admin",
  academic_admin: "Academic Admin",
  hod: "Head of Department",
  faculty: "Faculty",
  student: "Student",
  registrar: "Registrar",
  examiner: "Examiner",
  research_supervisor: "Research Supervisor",
};

export const ADMIN_ROLES = ["super_admin", "academic_admin", "registrar", "examiner", "hod"];
