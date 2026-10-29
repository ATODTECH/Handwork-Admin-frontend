import { createDataTableColumns } from "@/components/table-data/columns"
import { formatActivityDate } from "@/lib/format"
import { ChevronDown, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const noop = () => toast("coming soon!")

const column = createDataTableColumns<Users>()

export const userColumns = (onAction: (event: Users) => void) =>
  column.columns([
    column.accessor("name", {
      header: ({column})=>{
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className={"flex justify-between text-xs uppercase font-semibold w-full"}
          >
            Name
            <div className="flex flex-col ">
              <ChevronDown size={16} className="rotate-180 h-2.5 w-auto" />
              <ChevronDown size={16} className="h-2.5 w-auto" />
            </div>
          </Button>
        )
      },
      meta: { cellClassName: "font-medium text-hw-grey-900" },
    }),
    column.accessor("role", {
      header: ({column})=>{
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className={"flex justify-between text-xs uppercase font-semibold w-full"}
          >
            Role
            <div className="flex flex-col ">
              <ChevronDown size={16} className="rotate-180 h-2.5 w-auto" />
              <ChevronDown size={16} className="h-2.5 w-auto" />
            </div>
          </Button>
        )
      },
      meta: { cellClassName: "text-hw-grey-700" },
    }),
    column.accessor("email", {
      header: ({column})=>{
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className={"flex justify-between text-xs uppercase font-semibold w-full"}
          >
            Email
            <div className="flex flex-col ">
              <ChevronDown size={16} className="rotate-180 h-2.5 w-auto" />
              <ChevronDown size={16} className="h-2.5 w-auto" />
            </div>
          </Button>
        )
      },
      meta: { cellClassName: "text-hw-grey-700" },
    }),
    column.accessor("phone", {
      header: "Phone NO.",
      meta: { cellClassName: "text-hw-grey-900" },
    }),
    column.accessor("joinedAt", {
      header: "Date Joined",
      meta: { cellClassName: "text-hw-grey-900" },
      cell: ({ getValue }) => <time dateTime={getValue()}>{formatActivityDate(getValue())}</time>,
    }),
    column.display({
      id: "actions",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<button
              type="button"
              aria-label={`View ${row.original.name}`}
              className="rounded-md border border-violet-200 h-8 w-8 font-medium text-hw-grey-900 hover:bg-secondary cursor-pointer"/>
            }
          >
            {/* <span className="sr-only">Open menu</span> */}
            <MoreVertical size={16} className="mx-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => onAction(row.original)}
                className={"py-1 text-sm text-hw-grey-700 focus:text-hw-grey-700"}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
            <DropdownMenuItem onClick={noop} className={"py-1 text-hw-secondary focus:text-hw-secondary text-sm"}>Suspend</DropdownMenuItem>
            <DropdownMenuItem onClick={noop} className={"py-1 text-hw-primary focus:text-hw-primary text-sm"}>Disable</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ])
