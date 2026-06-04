import type { ReactNode } from "react";

export type BadgeVariant = "approved" | "pending" | "rejected" | "info" | "neutral";

export function Badge({
  children,
  variant = "neutral"
}: {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
