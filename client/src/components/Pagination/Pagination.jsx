import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.scss";

function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  recordsPerPage,
  onPageChange,
}) {
  const start = totalRecords === 0 ? 0 : (currentPage - 1) * recordsPerPage + 1;
  const end = Math.min(currentPage * recordsPerPage, totalRecords);

  const getPageNumbers = () => {
    const pages = [];

    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));

    const endPage = Math.min(totalPages, startPage + 4);

    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="pagination" aria-label="Records pagination">
      <p className="pagination__info">
        Showing {start}-{end} of {totalRecords} records
      </p>

      <div className="pagination__controls">
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              aria-label="Go to page 1"
            >
              1
            </button>

            {pageNumbers[0] > 2 && (
              <span className="pagination__ellipsis">...</span>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            className={currentPage === page ? "pagination__page--active" : ""}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="pagination__ellipsis">...</span>
            )}

            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              aria-label={`Go to page ${totalPages}`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          aria-label="Next page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
export default Pagination;
