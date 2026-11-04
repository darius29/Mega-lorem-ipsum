import { Pencil, Trash2 } from "lucide-react";
import "./RecordsTable.scss";
import SortableHeader from "./SortableHeader";

function RecordsTable({ records, sortConfig, onSort, onEdit, onDelete }) {
  return (
    <div className="records-table__wrapper">
      <table className="records-table">
        <thead>
          <tr>
            <SortableHeader
              label="ID"
              sortKey="id"
              sortConfig={sortConfig}
              onSort={onSort}
            />

            <SortableHeader
              label="Title"
              sortKey="title"
              sortConfig={sortConfig}
              onSort={onSort}
            />

            <SortableHeader
              label="Category"
              sortKey="category"
              sortConfig={sortConfig}
              onSort={onSort}
            />

            <SortableHeader
              label="Description"
              sortKey="description"
              sortConfig={sortConfig}
              onSort={onSort}
            />

            <SortableHeader
              label="Status"
              sortKey="status"
              sortConfig={sortConfig}
              onSort={onSort}
            />

            <SortableHeader
              label="Created At"
              sortKey="created_at"
              sortConfig={sortConfig}
              onSort={onSort}
            />
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => {
            return (
              <tr key={record.id}>
                <td className="records-table__id">#{record.id}</td>
                <td className="records-table__title">{record.title}</td>
                <td>
                  <span
                    className={`records-table__category records-table__category--${record.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    {record.category}
                  </span>
                </td>
                <td>
                  <span className="records-table__description">
                    {record.description}
                  </span>
                </td>
                <td>
                  <span
                    className={`records-table__status records-table__status--${record.status.toLowerCase()}`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="records-table__created_at">
                  {record.created_at}
                </td>
                <td>
                  <div className="records-table__actions">
                    <button
                      className="records-table__action--edit"
                      type="button"
                      aria-label={`Edit ${record.title}`}
                      onClick={(event) => onEdit(record, event.currentTarget)}
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </button>

                    <button
                      className="records-table__action--delete"
                      type="button"
                      aria-label={`Delete ${record.title}`}
                      onClick={(event) => onDelete(record, event.currentTarget)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RecordsTable;
