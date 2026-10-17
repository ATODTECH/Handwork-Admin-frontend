"use client"

import { useMemo, useState } from "react"
import { useTable, type ColumnFiltersState } from "@tanstack/react-table"
import { cn } from "cn"
import { ProgressBar } from "@/components/shared/progress-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { WidgetEmpty, WidgetError } from "@/components/widget-state"
import { dataTableFeatures, type DataTableColumns } from "./columns"
import { FilterInput } from "./data-table-features"
import { FilterSelect } from "../shared/filter-select"

interface DataTableSelection {
  selectedIds: ReadonlySet<string>
  onChange: (next: Set<string>) => void
  /** Accessible name for a row's checkbox, e.g. the person's name. */
  rowLabel: (id: string) => string
}

export interface DataTableProps<TData extends object> {
  /** Names the table for screen readers. */
  label: string
  columns: DataTableColumns<TData>
  data: readonly TData[]
  getRowId: (row: TData) => string
  isLoading?: boolean
  /** Background refetch or page change with rows still on screen. */
  isRefreshing?: boolean
  /** Table filters for specific number of columns */
  filterBy?: string
  tableFilters?: React.ReactNode
  // tableFilters: readonly FilterOption<T>[]
  skeletonRows?: number
  error?: Error | null
  onRetry?: () => void
  isRetrying?: boolean
  emptyMessage?: string
  /** Adds a checkbox column. Selection is by id, so it survives paging. */
  selection?: DataTableSelection
  /** Pagination or anything else under the rows. */
  footer?: React.ReactNode
  /** Tailwind min-width for the table before it scrolls sideways. */
  minWidthClassName?: string
  rowClassName?: (row: TData) => string | undefined
  className?: string
}

const NO_ROWS: never[] = []

export function DataTable<TData extends object>({
  label,
  columns,
  data,
  getRowId,
  isLoading = false,
  isRefreshing = false,
  filterBy,
  tableFilters,
  skeletonRows = 8,
  error,
  onRetry,
  isRetrying = false,
  emptyMessage = "Nothing to show yet.",
  selection,
  footer,
  minWidthClassName = "min-w-[950px]",
  rowClassName,
  className,
}: DataTableProps<TData>) {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  
  const rows = useMemo(() => (data.length ? [...data] : NO_ROWS), [data])

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: rows,
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    getRowId: (row) => getRowId(row),
  })

  const columnCount = columns.length + (selection ? 1 : 0)

  const showError = Boolean(error) && rows.length === 0 && !isLoading

  return (
    <>
      {(!showError && tableFilters) && (
        <FilterInput columnId={filterBy??""} table={table}>
          {tableFilters}
        </FilterInput>
      )}

      <div className={cn("shrink-0 overflow-hidden border border-hw-grey-200 ", className)}>
        <ProgressBar className={isRefreshing ? "visible" : "invisible"} />
        {showError ? (
          <WidgetError message={error!.message} onRetry={() => onRetry?.()} isRetrying={isRetrying} className="py-16" />
        ) : (
          <div aria-busy={isLoading || isRefreshing}>
            <Table aria-label={label} className={cn(minWidthClassName, "transition-opacity", isRefreshing && "opacity-60")}>
              <TableHeader>
                {table.getHeaderGroups().map((group) => (
                  <TableRow key={group.id} className="border-b-primary-border bg-[#FBFBFD] hover:bg-[#FBFBFD]">
                    {group.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        scope="col"
                        className={cn(
                          "h-auto py-3.75 text-xs text-hw-grey-900 font-semibold uppercase first:pl-5 last:pr-5",
                          header.column.columnDef.meta?.headerClassName,
                        )}
                      >
                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: skeletonRows }, (_, index) => (
                    <TableRow key={index} aria-hidden className="hover:bg-transparent">
                      {Array.from({ length: columnCount }, (_, cell) => (
                        <TableCell key={cell} className="py-4 first:pl-5 last:pr-5">
                          <Skeleton className={cn("h-4", cell === 0 && selection ? "w-4 rounded" : cell % 3 === 1 ? "w-32" : "w-20")} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : rows.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={columnCount}>
                      <WidgetEmpty message={emptyMessage} className="py-14" />
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => {
                    const isSelected = selection?.selectedIds.has(row.id) ?? false
                    return (
                      <TableRow
                        key={row.id}
                        data-state={isSelected ? "selected" : undefined}
                        className={cn("border-slate-100 data-[state=selected]:bg-violet-50/40", rowClassName?.(row.original))}
                      >
                        {row.getAllCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn("py-3 text-sm first:pl-5 last:pr-5", cell.column.columnDef.meta?.cellClassName)}
                          >
                            <table.FlexRender cell={cell} />
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
            {isLoading && <span role="status" className="sr-only">Loading {label.toLowerCase()}</span>}
          </div>
        )}
        {footer}
      </div>
    </>
  )
}
