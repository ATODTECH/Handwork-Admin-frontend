"use client"

import { DataTable } from "@/components/table-data/data-table"
import { HeaderPage, ROUTES } from "@/lib/routes"
import Link from "next/link"
import { useMemo, useState } from "react"
import { userColumns } from "../dashboard/recent-users/columns"
import { toast } from "sonner"
import { DataTablePagination } from "@/components/table-data/data-table-pagination"
import { AllUserColumnFilters, COLUMN_FILTERS } from "./constants"
import { FilterSelect } from "@/components/shared/filter-select"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { UseAvatar } from "@/components/shared/use-avatar"
import { PageHeader } from "@/components/shared/page-header"

export const USER_PAGE_SIZE = 8

// Dummy Data
export const SAMPLE_USERS: Users[] = [
  { id:"1", name:"Lawal Halima", role:"user", email:"lawalhalima@gmail.com", phone:"08136401829", joinedAt:"2025-07-02"},
  { id:"2", name:"Chukwuemeka Eze", role:"artisan", email:"c.eze.artisan@gmail.com", phone:"08022334455", joinedAt:"2025-07-03"},
  { id:"3", name:"Amina Bello", role:"user", email:"amina.bello@yahoo.com", phone:"07055678901", joinedAt:"2025-07-03"},
  { id:"4", name:"Tunde Fashola", role:"artisan", email:"t.fashola@artisan.ng", phone:"08099887766", joinedAt:"2025-07-04"},
  { id:"5", name:"Ngozi Obi", role:"user", email:"ngozi.obi@gmail.com", phone:"08031122334", joinedAt:"2025-07-04"},
  { id:"6", name:"Samuel Adeyemi", role:"artisan", email:"sam.adeyemi@artisan.ng", phone:"09012345678", joinedAt:"2025-07-05"},
  { id:"7", name:"Fatima Garba", role:"user", email:"fatima.garba@yahoo.com", phone:"08077665544", joinedAt:"2025-07-05"},
  { id:"8", name:"Babatunde Okafor", role:"artisan", email:"b.okafor.craft@gmail.com", phone:"08154433221", joinedAt:"2025-07-06"},
]

const NO_RECENTUSER: Users[] = []

const UserManagementIndex = () => {
  const headerTitle = HeaderPage()
  const [data, setData] = useState(SAMPLE_USERS)
  const [filter, setFilter] = useState<AllUserColumnFilters["filter"]>()
  const [reviewing, setReviewing] = useState<Users | null>(null)

  const filters = useMemo<AllUserColumnFilters>(
    () => ({filter: filter === "all" ? undefined : filter }),
    [filter],
  )
  const hasFilters = filter !== undefined

  const total = data?.length ?? NO_RECENTUSER

  const columns = useMemo(() => userColumns((val)=> setReviewing(val)), [])

  const filterKey = JSON.stringify(filters)
  const [pageState, setPageState] = useState({ filterKey, page: 1 })
  if (pageState.filterKey !== filterKey) setPageState({ filterKey, page: 1 })
  const page = pageState.filterKey === filterKey ? pageState.page : 1

  return (
    <section className="flex-1 flex flex-col py-7.5 pr-8 overflow-y-auto scrollbar-thin">
      <PageHeader
        title={headerTitle.title}
        description={headerTitle.description}
        action={(
          <Link
            href={ROUTES.artisans}
            className=" px-7 py-3 2xl:px-9.75 2xl:py-4 rounded-lg bg-[#172153] text-[15px] 2xl:text-base text-hw-base-white"
          >
            Approve Artisan
          </Link>
        )}
      />

      {/* Table */}
      <DataTable
        label="Users"
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        filterBy={filter}
        tableFilters={
          <FilterSelect label="Users" filter="Filter"  options={COLUMN_FILTERS} value={filter} onChange={setFilter} />
        }
        skeletonRows={USER_PAGE_SIZE}
        emptyMessage={filters.filter==="all" ? "No match for the current filter." : "No user yet."}
        className="rounded-xl bg-hw-base-white"
        footer={
          <DataTablePagination
            page={page}
            pageSize={USER_PAGE_SIZE}
            total={total}
            onPageChange={(next) => setPageState({ filterKey, page: next })}
            noun={{ one: "user", other: "users" }}
          />
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
    </section>
  )
}

export default UserManagementIndex