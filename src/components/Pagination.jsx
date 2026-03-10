import './Pagination.css';

const PAGE_SIZE = 12;

function Pagination({ currentPage, totalItems, onPageChange }) {
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination">
      <span className="pagination__showing">
        Showing {startItem}–{endItem} of {totalItems} items
      </span>
      <div className="pagination__controls">
        <button
          className="pagination__arrow"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`pagination__page${page === currentPage ? ' pagination__page--active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination__arrow"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12L6 8l4-4" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

export { PAGE_SIZE };
export default Pagination;
