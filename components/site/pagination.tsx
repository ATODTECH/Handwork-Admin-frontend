import { ChevronRight } from "lucide-react"

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  const goTo = (p: number) => {
    if (p < 1 || p > totalPages) return
    onChange(p)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
            p === page
              ? "bg-secondary-blue text-white"
              : "bg-primary-white text-slate-500 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-md bg-slate-200 text-slate-500 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-300 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
