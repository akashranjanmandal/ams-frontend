"use client";

export function Logo({
  size = 44,
  light = false,
}: {
  size?: number;
  light?: boolean;
}) {
  const boxBg = light ? "rgba(255,255,255,0.16)" : "var(--color-green)";
  const stroke = light ? "#fff" : "#fff";
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        {/* circular emblem */}
        <circle cx="32" cy="32" r="28" fill={boxBg} />
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke={light ? "rgba(255,255,255,0.5)" : "var(--color-green-deep)"}
          strokeWidth="2"
        />
        {/* AV monogram */}
        <path
          d="M20 44 L32 18 L44 44"
          stroke={stroke}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M25 37 L39 37" stroke={stroke} strokeWidth="3.4" strokeLinecap="round" />
        {/* fish/leaf motif */}
        <path d="M30 49 q6 -4 12 0 q-6 4 -12 0 Z" fill={stroke} opacity="0.85" />
      </svg>
      <div className="leading-tight">
        <div
          className="text-xl font-bold"
          style={{ color: light ? "#fff" : "var(--color-green-deep)" }}
        >
          AVFU&nbsp;HRMS
        </div>
        <div
          className="text-[11px] font-medium tracking-wide"
          style={{ color: light ? "rgba(255,255,255,0.75)" : "var(--color-ink-faint)" }}
        >
          Veterinary &amp; Fisheries University
        </div>
      </div>
    </div>
  );
}
