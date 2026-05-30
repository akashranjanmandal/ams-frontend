import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "alertCircle"
  | "alertTriangle"
  | "bell"
  | "calendar"
  | "check"
  | "chevronDown"
  | "chevronLeft"
  | "chevronRight"
  | "circleCheck"
  | "download"
  | "edit"
  | "home"
  | "info"
  | "plus"
  | "search"
  | "settings"
  | "trash"
  | "user"
  | "x";

const paths: Record<IconName, ReactNode> = {
  alertCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
  alertTriangle: (
    <>
      <path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  bell: (
    <>
      <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    </>
  ),
  calendar: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  check: <path d="m20 6-11 11-5-5" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  circleCheck: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  settings: (
    <>
      <path d="M12.2 2h-.4l-1 2.6a7.7 7.7 0 0 0-1.7.7L6.5 4.2l-.3.3-2 3.4.2.3 2.1 1.7a7.1 7.1 0 0 0 0 2.2l-2.1 1.7-.2.3 2 3.4.3.3 2.6-1.1c.5.3 1.1.5 1.7.7l1 2.6h.4l1-2.6c.6-.2 1.2-.4 1.7-.7l2.6 1.1.3-.3 2-3.4-.2-.3-2.1-1.7a7.1 7.1 0 0 0 0-2.2l2.1-1.7.2-.3-2-3.4-.3-.3-2.6 1.1a7.7 7.7 0 0 0-1.7-.7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </>
  ),
  user: (
    <>
      <path d="M19 21a7 7 0 0 0-14 0" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  )
};

export function Icon({
  name,
  size = 16,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
