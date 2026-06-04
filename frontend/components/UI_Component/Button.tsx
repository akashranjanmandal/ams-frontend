import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  children,
  icon,
  size = "md",
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: IconName;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {icon ? <Icon name={icon} size={15} /> : null}
      {children}
    </button>
  );
}

export function IconButton({
  label,
  icon,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  label: string;
}) {
  return (
    <button aria-label={label} className={`btn-icon ${className}`} title={label} {...props}>
      <Icon name={icon} size={16} />
    </button>
  );
}
