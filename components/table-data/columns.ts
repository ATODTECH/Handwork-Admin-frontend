import { createColumnHelper, createSortedRowModel, metaHelper, sortFn_alphanumeric, sortFn_text, tableFeatures, rowSortingFeature, columnFilteringFeature, type ColumnDef, createFilteredRowModel, filterFn_includesString, filterFn_inNumberRange } from "@tanstack/react-table"

export interface DataTableColumnMeta {
  headerClassName?: string
  cellClassName?: string
}


export const dataTableFeatures = tableFeatures({
  columnMeta: metaHelper<DataTableColumnMeta>(),
  columnFilteringFeature,
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  sortedRowModel: createSortedRowModel(),
})

export type DataTableFeatures = typeof dataTableFeatures

export type DataTableColumns<TData extends object> = ColumnDef<DataTableFeatures, TData, any>[]

export const createDataTableColumns = <TData extends object>() => createColumnHelper<DataTableFeatures, TData>()
