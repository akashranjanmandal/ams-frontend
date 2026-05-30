import { Icon } from "./Icon";

export function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="searchbar">
      <Icon className="s-icon" name="search" size={15} />
      <input aria-label="Search" placeholder={placeholder} type="search" />
      <div className="search-kbd" aria-hidden="true">
        <span className="kbd">Ctrl</span>
        <span className="kbd">K</span>
      </div>
    </div>
  );
}
