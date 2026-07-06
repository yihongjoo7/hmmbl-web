'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

function getPageRange(current: number, total: number, sibling: number): (number | '...')[] {
  const range: number[] = [];
  for (let i = Math.max(2, current - sibling); i <= Math.min(total - 1, current + sibling); i++) range.push(i);
  const pages: (number | '...')[] = [1];
  if (range[0] > 2) pages.push('...');
  pages.push(...range);
  if (range[range.length - 1] < total - 1) pages.push('...');
  if (total > 1) pages.push(total);
  return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = getPageRange(currentPage, totalPages, siblingCount);
  return (
    <div className="flex items-center gap-1">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}
        className="px-2 py-1.5 rounded text-sm text-text-secondary disabled:opacity-30 hover:bg-bg-tertiary">
        이전
      </button>
      {pages.map((page, i) =>
        page === '...' ? <span key={`ellipsis-${i}`} className="px-2 text-text-disabled">…</span>
          : <button key={page} onClick={() => onPageChange(page as number)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
                ${currentPage === page ? 'bg-primary text-text-inverse' : 'text-text-primary hover:bg-bg-tertiary'}`}>
              {page}
            </button>
      )}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}
        className="px-2 py-1.5 rounded text-sm text-text-secondary disabled:opacity-30 hover:bg-bg-tertiary">
        다음
      </button>
    </div>
  );
}
