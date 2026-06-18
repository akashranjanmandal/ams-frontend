import {
  LayoutDashboard,
  User,
  CalendarDays,
  Clock,
  Users,
  Receipt,
  FileCheck2,
  LogOut as _LogOut,
  Plane,
  Award,
  Wallet,
  ScrollText,
  TrendingUp,
  ClipboardCheck,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { Role } from "./auth";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

const ALL: Role[] = ["employee", "hr", "admin"];
const STAFF: Role[] = ["hr", "admin"];

export const NAV: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ALL },
      { label: "Employee Directory", href: "/directory", icon: Users, roles: ALL },
    ],
  },
  {
    title: "My Workspace",
    items: [
      { label: "My Profile", href: "/profile", icon: User, roles: ALL },
      { label: "Leave", href: "/leave", icon: CalendarDays, roles: ALL },
      { label: "Attendance", href: "/attendance", icon: Clock, roles: ALL },
      { label: "Salary Slip", href: "/salary", icon: Receipt, roles: ALL },
      { label: "Assets & Liability", href: "/assets", icon: Wallet, roles: ALL },
    ],
  },
  {
    title: "Requests",
    items: [
      { label: "NOC", href: "/requests/noc", icon: ScrollText, roles: ALL },
      { label: "Vacation", href: "/requests/vacation", icon: Award, roles: ALL },
      { label: "Out of Station", href: "/requests/out-of-station", icon: Plane, roles: ALL },
      { label: "Resignation", href: "/requests/resignation", icon: FileCheck2, roles: ALL },
      { label: "DACP", href: "/requests/dacp", icon: TrendingUp, roles: ALL },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Approvals Center", href: "/manage/approvals", icon: ClipboardCheck, roles: STAFF },
      { label: "All Employees", href: "/manage/employees", icon: Building2, roles: STAFF },
    ],
  },
];

export function navForRole(role: Role): NavGroup[] {
  return NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.roles.includes(role)),
  })).filter((g) => g.items.length > 0);
}
