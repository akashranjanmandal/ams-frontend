export type ProgressTone = "purple" | "green" | "amber" | "red" | "blue";

export function ProgressBar({
  label,
  value,
  tone = "purple"
}: {
  label: string;
  value: number;
  tone?: ProgressTone;
}) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="progress-wrap">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-pct">{normalizedValue}%</span>
      </div>
      <div aria-label={label} aria-valuemax={100} aria-valuemin={0} aria-valuenow={normalizedValue} className="progress-track" role="progressbar">
        <div className={`progress-bar prog-${tone}`} style={{ width: `${normalizedValue}%` }} />
      </div>
    </div>
  );
}
