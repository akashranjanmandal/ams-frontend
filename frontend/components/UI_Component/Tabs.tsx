export function Tabs({
  tabs
}: {
  tabs: Array<{ label: string; count?: number; active?: boolean }>;
}) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          aria-selected={tab.active || false}
          className={`tab ${tab.active ? "active" : ""}`}
          key={tab.label}
          role="tab"
          type="button"
        >
          {tab.label}
          {typeof tab.count === "number" ? <span className="tab-count">{tab.count}</span> : null}
        </button>
      ))}
    </div>
  );
}
