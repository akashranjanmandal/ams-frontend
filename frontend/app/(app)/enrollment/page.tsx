"use client";

// ─── Static Enrollment Page ────────────────────────────────────────────────────
// Matches the HTML/CSS reference design exactly.
// Colours: accent #1e4fd8 / dark #1440b8 · surface #f4f6fb · DM Sans + DM Serif Display
// This file is intentionally static (no API calls) per product requirement.
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT       = "#0D6E6E";   // site-wide teal
const ACCENT_DARK  = "#178F8F";   // teal hover
const SURFACE      = "#f4f6fb";
const CARD_BG      = "#ffffff";
const TEXT_PRIMARY = "#111827";
const TEXT_MUTED   = "#6b7280";
const TEXT_LIGHT   = "#9ca3af";
const BORDER       = "#e5e7eb";

// ── Static demo data ──────────────────────────────────────────────────────────

const ENROLLMENT_ROWS = [
  {
    id: 1,
    studentName: "Arunabh Sarma",
    roll: "2021-AG-45",
    course: "AGR-501",
    program: "M.Sc. Agriculture",
    date: "Oct 12, 2023",
    status: "pending" as const,
  },
  {
    id: 2,
    studentName: "Priyanka Das",
    roll: "2022-VET-12",
    course: "VPT-601",
    program: "Ph.D. Veterinary Science",
    date: "Oct 14, 2023",
    status: "reviewing" as const,
  },
  {
    id: 3,
    studentName: "Manish Baruah",
    roll: "2021-AG-88",
    course: "AGR-501",
    program: "M.Sc. Agriculture",
    date: "Oct 15, 2023",
    status: "approved" as const,
  },
];

const COURSE_CARDS = [
  {
    id: 1,
    tag: "AGR-501",
    tagVariant: "agr" as const,
    name: "Advanced Crop Physiology",
    desc: "In-depth study of metabolic processes in field crops under various environmental stressors.",
    credits: 4,
    type: "Core Course",
  },
  {
    id: 2,
    tag: "VPT-601",
    tagVariant: "vpt" as const,
    name: "Veterinary Pharmacology",
    desc: "Mechanisms of action, pharmacokinetics, and clinical use of drugs in large animal species.",
    credits: 4,
    type: "Specialization",
  },
  {
    id: 3,
    tag: "EXT-504",
    tagVariant: "ext" as const,
    name: "Digital Extension Methods",
    desc: "Exploring modern ICT tools and social media frameworks for agricultural dissemination.",
    credits: 3,
    type: "Elective",
  },
];

const CREDIT_USED  = 14;
const CREDIT_LIMIT = 20;
const CORE_COUNT   = 3;
const ELECTIVE_COUNT = 1;

// ── Tag colour map ────────────────────────────────────────────────────────────

const TAG_STYLES: Record<"agr" | "vpt" | "ext", { bg: string; color: string }> = {
  agr: { bg: "#ede9fe", color: "#5b21b6" },
  vpt: { bg: "#dbeafe", color: "#1d4ed8" },
  ext: { bg: "#fef9c3", color: "#92400e" },
};

// ── Status badge ──────────────────────────────────────────────────────────────

type StatusType = "pending" | "reviewing" | "approved";

const BADGE_STYLES: Record<StatusType, { bg: string; color: string }> = {
  pending:   { bg: "#f3f4f6", color: "#4b5563" },
  reviewing: { bg: "#ff6b35", color: "#ffffff" },
  approved:  { bg: "#e0f2fe", color: "#0369a1" },
};

function StatusBadge({ status }: { status: StatusType }) {
  const s = BADGE_STYLES[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 30,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
        background: s.bg,
        color: s.color,
      }}
    >
      {status.toUpperCase()}
    </span>
  );
}

// ── Eye icon (inline SVG, no extra dep) ──────────────────────────────────────

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v8M8 12h8"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function EnrollmentPage() {
  const fillPct = Math.round((CREDIT_USED / CREDIT_LIMIT) * 100);

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: SURFACE,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Main content ──────────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          padding: "28px 28px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >

        {/* ══ ENROLLMENT APPROVALS ══════════════════════════════════════ */}
        <section
          style={{
            background: CARD_BG,
            borderRadius: 14,
            boxShadow: "0 1px 3px rgba(0,0,0,.08)",
            border: `1px solid ${BORDER}`,
            overflow: "hidden",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "22px 24px 16px",
              gap: 16,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 22,
                  color: ACCENT,
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: 4,
                }}
              >
                Enrollment Approvals
              </h2>
              <p style={{ fontSize: 13, color: TEXT_MUTED }}>
                Review and validate student course registrations for the Monsoon 2024 Semester.
              </p>
            </div>

            <button
              style={{
                background: ACCENT,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "9px 18px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = ACCENT_DARK)}
              onMouseLeave={(e) => (e.currentTarget.style.background = ACCENT)}
            >
              <CheckIcon /> Approve Selected
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13.5,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: SURFACE,
                    borderTop: `1px solid ${BORDER}`,
                    borderBottom: `1px solid ${BORDER}`,
                  }}
                >
                  {[
                    "STUDENT NAME",
                    "ROLL NUMBER",
                    "COURSE",
                    "PROGRAM",
                    "DATE",
                    "STATUS",
                    "ACTIONS",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 20px",
                        textAlign: "left",
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: TEXT_MUTED,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ENROLLMENT_ROWS.map((row, i) => (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom:
                        i < ENROLLMENT_ROWS.length - 1
                          ? `1px solid ${BORDER}`
                          : "none",
                      transition: "background .12s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.background = "#f8faff")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLTableRowElement).style.background = "transparent")
                    }
                  >
                    {/* Student Name */}
                    <td
                      style={{
                        padding: "14px 20px",
                        color: TEXT_PRIMARY,
                        fontWeight: 600,
                        verticalAlign: "middle",
                      }}
                    >
                      {row.studentName}
                    </td>

                    {/* Roll */}
                    <td
                      style={{
                        padding: "14px 20px",
                        color: TEXT_MUTED,
                        fontSize: 13,
                        verticalAlign: "middle",
                      }}
                    >
                      {row.roll}
                    </td>

                    {/* Course link */}
                    <td style={{ padding: "14px 20px", verticalAlign: "middle" }}>
                      <a
                        href="#"
                        style={{
                          color: ACCENT,
                          fontWeight: 600,
                          textDecoration: "none",
                          fontSize: 13,
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "none")
                        }
                      >
                        {row.course}
                      </a>
                    </td>

                    {/* Program */}
                    <td
                      style={{
                        padding: "14px 20px",
                        color: TEXT_PRIMARY,
                        verticalAlign: "middle",
                      }}
                    >
                      {row.program}
                    </td>

                    {/* Date */}
                    <td
                      style={{
                        padding: "14px 20px",
                        color: TEXT_PRIMARY,
                        verticalAlign: "middle",
                      }}
                    >
                      {row.date}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px 20px", verticalAlign: "middle" }}>
                      <StatusBadge status={row.status} />
                    </td>

                    {/* Action */}
                    <td style={{ padding: "14px 20px", verticalAlign: "middle" }}>
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          color: ACCENT,
                          fontSize: 16,
                          cursor: "pointer",
                          padding: "4px 8px",
                          borderRadius: 6,
                          display: "inline-flex",
                          alignItems: "center",
                          transition: "background .12s",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background = "#eef2ff")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLButtonElement).style.background = "none")
                        }
                        aria-label="View enrollment"
                      >
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══ COURSE REGISTRATION ═══════════════════════════════════════ */}
        <section
          style={{
            background: CARD_BG,
            borderRadius: 14,
            boxShadow: "0 1px 3px rgba(0,0,0,.08)",
            border: `1px solid ${BORDER}`,
            overflow: "hidden",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "22px 24px 16px",
              gap: 16,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 22,
                  color: ACCENT,
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: 4,
                }}
              >
                Course Registration
              </h2>
              <p style={{ fontSize: 13, color: TEXT_MUTED }}>
                Manage your current academic enrollment and credits.
              </p>
            </div>

            <button
              style={{
                background: ACCENT,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "9px 18px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = ACCENT_DARK)}
              onMouseLeave={(e) => (e.currentTarget.style.background = ACCENT)}
            >
              <PlusCircleIcon /> Register for New Course
            </button>
          </div>

          {/* ── Credit utilisation bar ──────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: SURFACE,
              borderTop: `1px solid ${BORDER}`,
              borderBottom: `1px solid ${BORDER}`,
              padding: "14px 24px",
              gap: 20,
            }}
          >
            {/* Bar */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>
                  Credit Limit Utilization
                </span>
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>
                  {CREDIT_USED} / {CREDIT_LIMIT} Credits
                </span>
              </div>
              <div
                style={{
                  height: 7,
                  background: "#d1d5db",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${fillPct}%`,
                    background: ACCENT,
                    borderRadius: 99,
                    transition: "width .4s",
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexShrink: 0,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: TEXT_PRIMARY,
                  }}
                >
                  {CORE_COUNT}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: TEXT_MUTED,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Core Courses
                </div>
              </div>

              <div
                style={{
                  width: 1,
                  height: 36,
                  background: BORDER,
                }}
              />

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: TEXT_PRIMARY,
                  }}
                >
                  {ELECTIVE_COUNT}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: TEXT_MUTED,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Electives
                </div>
              </div>
            </div>
          </div>

          {/* ── Course cards ─────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 18,
              padding: "20px 24px 24px",
            }}
            className="enrollment-cards-grid"
          >
            {COURSE_CARDS.map((card) => {
              const tagStyle = TAG_STYLES[card.tagVariant];
              return (
                <div
                  key={card.id}
                  style={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: 16,
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    transition: "box-shadow .15s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 4px 16px rgba(0,0,0,.10)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")
                  }
                >
                  {/* Top row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 30,
                        letterSpacing: "0.03em",
                        background: tagStyle.bg,
                        color: tagStyle.color,
                      }}
                    >
                      {card.tag}
                    </span>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: TEXT_LIGHT,
                        cursor: "pointer",
                        fontSize: 14,
                        padding: "2px 4px",
                        borderRadius: 4,
                        display: "inline-flex",
                        transition: "background .12s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = SURFACE;
                        (e.currentTarget as HTMLButtonElement).style.color = TEXT_MUTED;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "none";
                        (e.currentTarget as HTMLButtonElement).style.color = TEXT_LIGHT;
                      }}
                      aria-label="More options"
                    >
                      <DotsIcon />
                    </button>
                  </div>

                  {/* Course name */}
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: TEXT_PRIMARY,
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {card.name}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 12.5,
                      color: TEXT_MUTED,
                      lineHeight: 1.55,
                      flex: 1,
                      margin: 0,
                    }}
                  >
                    {card.desc}
                  </p>

                  {/* Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 4,
                      borderTop: `1px solid ${BORDER}`,
                      paddingTop: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: ACCENT,
                      }}
                    >
                      {card.credits} Credits
                    </span>
                    <span style={{ fontSize: 12, color: TEXT_MUTED }}>
                      {card.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#fff",
          borderTop: `1px solid ${BORDER}`,
          padding: "14px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          color: TEXT_MUTED,
        }}
      >
        <span>© 2024 Assam Agricultural University. All rights reserved.</span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Service", "Support"].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                textDecoration: "none",
                color: TEXT_MUTED,
                fontSize: 12,
                transition: "color .12s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = ACCENT)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = TEXT_MUTED)
              }
            >
              {l}
            </a>
          ))}
        </div>
      </footer>

      {/* ── FAB ─────────────────────────────────────────────────────────── */}
      <button
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 44,
          height: 44,
          background: ACCENT,
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          fontSize: 18,
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(30,79,216,.4)",
          display: "grid",
          placeItems: "center",
          transition: "background .15s, transform .15s",
          zIndex: 200,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = ACCENT_DARK;
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.07)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = ACCENT;
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        aria-label="Chat support"
      >
        {/* Chat bubble icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
        </svg>
      </button>

      {/* ── Responsive grid fix (narrow screens) ─────────────────────── */}
      <style>{`
        @media (max-width: 900px) {
          .enrollment-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .enrollment-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
