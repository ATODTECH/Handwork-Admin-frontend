
interface FilterInputProps {
  columnId: string;
  table: any;
  children: React.ReactNode;
}

export const FilterInput = ({
  columnId,
  table,
  children,
}: FilterInputProps) => {
  return (
    <div className="flex items-center justify-end gap-4 mb-6">
      {columnId && (
        <input
          placeholder={`Filter by ${columnId}...`}
          value={(table?.getColumn(columnId)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table?.getColumn(columnId)?.setFilterValue(event.target.value)
          }
          className="max-w-sm ring ring-hw-border py-1.5 px-2.5 rounded-sm text-[13px]"
        />
      )}
      { children }
    </div>
  )
}

