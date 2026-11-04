import { Search, Plus } from "lucide-react";
import "./RecordsToolbar.scss";

function RecordsToolbar({ search, onSearchChange, onAddRecord }) {
  return (
    <div className="records-toolbar">
      <div className="records-toolbar__search">
        <Search
          className="records-toolbar__search-icon"
          size={20}
          aria-hidden="true"
        />

        <input
          type="search"
          aria-label="Search records"
          placeholder="Search records..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <button
        type="button"
        className="records-toolbar__add"
        onClick={(event) => onAddRecord(event.currentTarget)}
      >
        <Plus size={20} aria-hidden="true" />
        <span>Add Record</span>
      </button>
    </div>
  );
}

export default RecordsToolbar;
