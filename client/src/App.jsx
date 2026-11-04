import { useEffect, useState, useMemo, useRef } from "react";
import Header from "./components/Header/Header";
import RecordsTable from "./components/RecordsTable/RecordsTable";
import RecordsToolbar from "./components/RecordsToolbar/RecordsToolbar";
import Pagination from "./components/Pagination/Pagination";
import RecordModal from "./components/RecordModal/RecordModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal/DeleteConfirmModal";
import {
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from "./services/records.api";

function App() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "asc",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(
    () => new URLSearchParams(window.location.search).get("modal") === "create",
  );
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const modalOpenedHere = useRef(false);
  const [closeRequested, setCloseRequested] = useState(false);
  const modalTriggerRef = useRef(null);
  const focusAfterCloseRef = useRef(false);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const data = await getRecords();
        setRecords(data);

        const params = new URLSearchParams(window.location.search);
        const modalType = params.get("modal");
        const id = Number(params.get("id"));

        const record = data.find((item) => item.id === id);

        if (modalType === "edit" && record) {
          setSelectedRecord(record);
        } else if (modalType === "delete" && record) {
          setRecordToDelete(record);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    const result = records.filter((record) =>
      [
        record.id,
        record.title,
        record.category,
        record.description,
        record.status,
        record.created_at,
      ].some((value) => String(value).toLocaleLowerCase().includes(query)),
    );

    return result.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      let comparison;

      if (sortConfig.key === "id") {
        comparison = Number(valueA) - Number(valueB);
      } else {
        comparison = String(valueA).localeCompare(String(valueB), undefined, {
          sensitivity: "base",
          numeric: true,
        });
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [records, search, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((previous) => ({
      key,
      direction:
        previous.key === key && previous.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / recordsPerPage),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (currentPage - 1) * recordsPerPage;

  const paginatedRecords = filteredRecords.slice(
    startIndex,
    startIndex + recordsPerPage,
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCreateRecord = async (recordData) => {
    const newRecord = await createRecord(recordData);

    setRecords((previous) => [...previous, newRecord]);

    setSearch("");
    setSortConfig({ key: "id", direction: "desc" });
    setCurrentPage(1);
  };

  const handleOpenAddModal = (triggerElement) => {
    if (isAddModalOpen || selectedRecord || recordToDelete) return;

    modalTriggerRef.current = triggerElement;

    const url = new URL(window.location.href);
    url.searchParams.set("modal", "create");
    url.searchParams.delete("id");

    window.history.pushState({}, "", url);

    modalOpenedHere.current = true;
    setCloseRequested(false);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    if (modalOpenedHere.current) {
      modalOpenedHere.current = false;
      window.history.back();
    } else {
      const url = new URL(window.location.href);

      if (url.searchParams.get("modal") === "delete") {
        url.searchParams.delete("modal");
        url.searchParams.delete("id");
        window.history.replaceState({}, "", url);
      }
      modalOpenedHere.current = false;
    }

    setIsAddModalOpen(false);
    setSelectedRecord(null);
    setCloseRequested(false);

    focusAfterCloseRef.current = true;
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const modalType = params.get("modal");
      const id = Number(params.get("id"));

      const record = records.find((item) => item.id === id);

      modalOpenedHere.current = false;

      if (modalType === "create") {
        setSelectedRecord(null);
        setRecordToDelete(null);
        setCloseRequested(false);
        setIsAddModalOpen(true);
      } else if (modalType === "edit" && record) {
        setIsAddModalOpen(false);
        setRecordToDelete(null);
        setCloseRequested(false);
        setSelectedRecord(record);
      } else if (modalType === "delete" && record) {
        setIsAddModalOpen(false);
        setSelectedRecord(null);
        setCloseRequested(false);
        setRecordToDelete(record);
      } else {
        const hasOpenModal =
          isAddModalOpen || selectedRecord !== null || recordToDelete !== null;

        if (hasOpenModal) {
          setCloseRequested(true);
        } else {
          setCloseRequested(false);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [records, isAddModalOpen, selectedRecord, recordToDelete]);

  const handleEditRecord = (record, triggerElement) => {
    if (isAddModalOpen || selectedRecord || recordToDelete) return;

    modalTriggerRef.current = triggerElement;

    const url = new URL(window.location.href);
    url.searchParams.set("modal", "edit");
    url.searchParams.set("id", String(record.id));

    window.history.pushState({}, "", url);

    modalOpenedHere.current = true;
    setCloseRequested(false);
    setSelectedRecord(record);
  };

  const handleUpdateRecord = async (recordData) => {
    const updatedRecord = await updateRecord(selectedRecord.id, recordData);

    setRecords((previous) =>
      previous.map((record) =>
        record.id === updatedRecord.id ? updatedRecord : record,
      ),
    );
  };

  const handleDeleteClick = (record, triggerElement) => {
    if (isAddModalOpen || selectedRecord || recordToDelete) return;

    modalTriggerRef.current = triggerElement;

    const url = new URL(window.location.href);
    url.searchParams.set("modal", "delete");
    url.searchParams.set("id", String(record.id));

    window.history.pushState({}, "", url);

    modalOpenedHere.current = true;
    setCloseRequested(false);
    setRecordToDelete(record);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    await deleteRecord(recordToDelete.id);

    setRecords((previous) =>
      previous.filter((record) => record.id !== recordToDelete.id),
    );
  };

  const handleCloseDelete = () => {
    const url = new URL(window.location.href);

    if (url.searchParams.get("modal") === "delete") {
      url.searchParams.delete("modal");
      url.searchParams.delete("id");
      window.history.replaceState({}, "", url);
    }
    modalOpenedHere.current = false;
    setRecordToDelete(null);
    setCloseRequested(false);

    focusAfterCloseRef.current = true;
  };

  useEffect(() => {
    const anyModalOpen =
      isAddModalOpen || selectedRecord !== null || recordToDelete !== null;

    if (!anyModalOpen && focusAfterCloseRef.current) {
      focusAfterCloseRef.current = false;

      const triggerElement = modalTriggerRef.current;
      modalTriggerRef.current = null;

      if (triggerElement?.isConnected) {
        triggerElement.focus();
      } else {
        document.querySelector(".records-toolbar button")?.focus();
      }
    }
  }, [isAddModalOpen, selectedRecord, recordToDelete]);

  return (
    <div className="app">
      <Header />
      <main className="app__content">
        <RecordsToolbar
          search={search}
          onSearchChange={handleSearchChange}
          onAddRecord={handleOpenAddModal}
        />

        {loading && <p>Loading records</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && (
          <>
            <p>
              Showing {filteredRecords.length} of {records.length} records
            </p>
            <RecordsTable
              records={paginatedRecords}
              sortConfig={sortConfig}
              onSort={handleSort}
              onEdit={handleEditRecord}
              onDelete={handleDeleteClick}
            />

            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              totalRecords={filteredRecords.length}
              recordsPerPage={recordsPerPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      {isAddModalOpen && (
        <RecordModal
          mode="create"
          onClose={handleCloseModal}
          onSave={handleCreateRecord}
          closeRequested={closeRequested}
        />
      )}

      {selectedRecord && (
        <RecordModal
          key={selectedRecord.id}
          mode="edit"
          record={selectedRecord}
          onClose={handleCloseModal}
          onSave={handleUpdateRecord}
          closeRequested={closeRequested}
        />
      )}

      {recordToDelete && (
        <DeleteConfirmModal
          record={recordToDelete}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
          closeRequested={closeRequested}
        />
      )}
    </div>
  );
}

export default App;
