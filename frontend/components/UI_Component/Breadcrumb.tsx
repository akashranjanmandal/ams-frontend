import { Icon } from "./Icon";

export function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <span className="bc-item">
        <Icon name="home" size={14} />
      </span>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span className="bc-group" key={item}>
            <span className="bc-sep">
              <Icon name="chevronRight" size={12} />
            </span>
            <span aria-current={isLast ? "page" : undefined} className={`bc-item ${isLast ? "active" : ""}`}>
              {item}
            </span>
          </span>
        );
      })}
    </nav>
  );
}
