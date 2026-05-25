"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsLoggedIn, useUser } from "@/stores/auth.store";
import { AMSSidebar } from "@/components/layouts/sidebar";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) router.replace("/login");
  }, [mounted, isLoggedIn, router]);

  if (!mounted || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <AMSSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className={cn("transition-all duration-200 min-h-screen", collapsed ? "ml-16" : "ml-[220px]")}>
        {children}
      </main>
    </div>
  );
}
