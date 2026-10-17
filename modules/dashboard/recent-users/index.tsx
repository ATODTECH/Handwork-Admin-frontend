import { DataTable } from "@/components/table-data/data-table";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { userColumns } from "./columns";
import { FilterSelect } from "@/components/shared/filter-select";
import { ROLE_FILTERS, UsersFilters } from "./constants";
import { X } from "lucide-react";
import { formatCount } from "@/lib/format";
import { SAMPLE_USERS } from "@/modules/users-management";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { DetailSheet } from "@/components/shared/detail-sheet";
import { UseAvatar } from "@/components/shared/use-avatar";

export const RECENTUSER_PAGE_SIZE = 8


const NO_RECENTUSER: Users[] = []


const RecentUsers = () => {
  const [data, setData] = useState(SAMPLE_USERS)
  const [role, setRole] = useState<UsersFilters["role"]>()
  const [date, setDate] = useState<UsersFilters["date"]>()
  const [reviewing, setReviewing] = useState<Users | null>(null)

  const filters = useMemo<UsersFilters>(
    () => ({ role: role === "all" ? undefined : role }),
    [role],
  )
  const hasFilters = role !== undefined
  
  const clearFilters = () => {
    setRole(undefined)
  }
  
  const total = data?.length ?? NO_RECENTUSER

  const router = useRouter();

  const columns = useMemo(() => userColumns((val)=> setReviewing(val)), [])
  
  return (
    <>
      <div className="flex gap-6 items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className=" text-lg font-semibold text-hw-grey-text-900">Recent Users</h2>
          <h3 className=" text-xs font-normal text-[#6D7280]">Latest registrations across all roles</h3>
        </div>
        {/* filters */}
        <div className="flex items-center gap-2">
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
          <FilterSelect label="User role" options={ROLE_FILTERS} value={role} onChange={setRole} />
        </div>
      </div>
      
      <DataTable
        label="Recent user"
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        skeletonRows={RECENTUSER_PAGE_SIZE}
        emptyMessage={hasFilters || role !== "all" ? "No match for the current filter." : "No user yet."}
        className="rounded-xl bg-hw-base-white"
        footer={
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
            <div className="flex text-sm font-semibold text-hw-grey-500">
              Showing&nbsp;<b className="text-hw-grey-900">{formatCount(data?.length??0)}</b>&nbsp;of&nbsp;<b className="text-hw-grey-900">{formatCount(total)}</b>&nbsp;users
            </div>
            <Button
              variant="secondary"
              onClick={() => router.push(ROUTES.users)}
              className="text-sm 2xl:text-base font-medium text-hw-base-white bg-hw-secondary cursor-pointer px-8 py-4 hover:bg-hw-secondary"
            >
              View all users
            </Button>
          </div>
        }
      />

      {/* modal */}
      <DetailSheet
        open={reviewing !== null}
        onOpenChange={(open) => !open && setReviewing(null)}
        title="User"
      >
        {reviewing && 
        <div className="">
          <UseAvatar src="" name={reviewing.name} aspectRatio="h-14 w-14" />
        </div>}
      </DetailSheet>
    </>
  )
}

export default RecentUsers