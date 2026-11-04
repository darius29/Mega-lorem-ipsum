import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import "./RecordsTable.scss";

function SortableHeader({ label, sortKey, sortConfig, onSort }) {
  const isActive = sortConfig.key === sortKey;

  const ariaSort = isActive
    ? sortConfig.direction === "asc"
      ? "ascending"
      : "descending"
    : undefined;

  return (
    <th scope="col" aria-sort={ariaSort}>
      <button
        type="button"
        className={`records-table__sort ${
          isActive ? "records-table__sort--active" : ""
        }`}
        onClick={() => onSort(sortKey)}
      >
        {label}

        {!isActive ? (
          <ArrowUpDown size={14} aria-hidden="true" />
        ) : sortConfig.direction === "asc" ? (
          <ArrowUp size={14} aria-hidden="true" />
        ) : (
          <ArrowDown size={14} aria-hidden="true" />
        )}
      </button>
    </th>
  );
}

export default SortableHeader;
