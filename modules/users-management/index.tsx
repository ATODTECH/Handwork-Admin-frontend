"use client"

import { DataTable } from "@/components/table-data/data-table"
import { HeaderPage, ROUTES } from "@/lib/routes"
import Link from "next/link"
import { useMemo, useState } from "react"
import { userColumns } from "../dashboard/recent-users/columns"
import { DataTablePagination } from "@/components/table-data/data-table-pagination"
import { AllUserColumnFilters, COLUMN_FILTERS } from "./constants"
import { FilterSelect } from "@/components/shared/filter-select"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { UseAvatar } from "@/components/shared/use-avatar"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { DetailRow, DetailSection } from "@/components/shared/details-part"
import { TONE_STYLES } from "@/lib/tones"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { toast } from "sonner"


export const USER_PAGE_SIZE = 8

// Dummy Data
export const SAMPLE_USERS: Users[] = [
  { id:"1", name:"Lawal Halima", role:"user", email:"lawalhalima@gmail.com", phone:"08136401829", status:"Verified", address:"House 20, close rebuild street, Ikeja", state:"Lagos", country:"Nigeria", emailVerified:"Not verified", phoneVerified:"Not verified", joinedAt:"2025-07-02"},
  { id:"2", name:"Chukwuemeka Eze", role:"artisan", email:"c.eze.artisan@gmail.com", phone:"08022334455", status:"Not verified", address:"House 20, close rebuild street, Ikeja", state:"Lagos", country:"Nigeria", emailVerified:"Not verified", phoneVerified:"Not verified", joinedAt:"2025-07-03"},
  { id:"3", name:"Amina Bello", role:"user", email:"amina.bello@yahoo.com", phone:"07055678901", status:"Not verified", address:"House 20, close rebuild street, Ikeja", state:"Lagos", country:"Nigeria", emailVerified:"Not verified", phoneVerified:"Not verified", joinedAt:"2025-07-03"},
  { id:"4", name:"Tunde Fashola", role:"artisan", email:"t.fashola@artisan.ng", phone:"08099887766", status:"Verified", address:"House 20, close rebuild street, Ikeja", state:"Lagos", country:"Nigeria", emailVerified:"Not verified", phoneVerified:"Not verified", joinedAt:"2025-07-04"},
  { id:"5", name:"Ngozi Obi", role:"user", email:"ngozi.obi@gmail.com", phone:"08031122334", status:"Not verified", address:"House 20, close rebuild street, Ikeja", state:"Lagos", country:"Nigeria", emailVerified:"Not verified", phoneVerified:"Not verified", joinedAt:"2025-07-04"},
  { id:"6", name:"Samuel Adeyemi", role:"artisan", email:"sam.adeyemi@artisan.ng", phone:"09012345678", status:"Not verified", address:"House 20, close rebuild street, Ikeja", state:"Lagos", country:"Nigeria", emailVerified:"Not verified", phoneVerified:"Not verified", joinedAt:"2025-07-05"},
  { id:"7", name:"Fatima Garba", role:"user", email:"fatima.garba@yahoo.com", phone:"08077665544", status:"Not verified", address:"House 20, close rebuild street, Ikeja", state:"Lagos", country:"Nigeria", emailVerified:"Not verified", phoneVerified:"Not verified", joinedAt:"2025-07-05"},
  { id:"8", name:"Babatunde Okafor", role:"artisan", email:"b.okafor.craft@gmail.com", phone:"08154433221", status:"Not verified", address:"House 20, close rebuild street, Ikeja", state:"Lagos", country:"Nigeria", emailVerified:"Not verified", phoneVerified:"Not verified", joinedAt:"2025-07-06"},
]

const noop = () => toast("coming soon!")

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
            className=" px-7 py-3 2xl:px-9.75 2xl:py-4 rounded-lg bg-secondary-blue text-[15px] 2xl:text-base text-hw-base-white"
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
        <div className=" divide-y divide-hw-grey-200">
          <div className="flex gap-4 pb-3">
            <UseAvatar src="" name={reviewing.name} aspectRatio="h-14 w-14" />
            <div className="flex flex-col gap-1.5">
              <span className=" text-lg font-semibold text-hw-grey-900">{reviewing.name}</span>
              <Badge variant={"outline"} className={" text-sm font-medium text-hw-secondary bg-[#E9EBF3]"}>{reviewing.role}</Badge>
            </div>
          </div>

          <DetailSection title="Personal & account information">
            <DetailRow label="Full Name">{reviewing.name}</DetailRow>
            <DetailRow label="Date Joined">{reviewing.joinedAt}</DetailRow>
            <DetailRow label="Account Status" className={TONE_STYLES[reviewing.status].text}>{reviewing.status}</DetailRow>
          </DetailSection>

          <DetailSection title="Contact & location">
            <DetailRow label="Email Address">{reviewing.email}</DetailRow>
            <DetailRow label="Phone Number">{reviewing.phone}</DetailRow>
            <DetailRow label="Contact Address">{reviewing.address}</DetailRow>
            <DetailRow label="State">{reviewing.state}</DetailRow>
            <DetailRow label="Country">{reviewing.country}</DetailRow>
          </DetailSection>

          <DetailSection title="Verification">
            <DetailRow label="Email Verification">{reviewing.emailVerified}</DetailRow>
            <DetailRow label="Phone Verification">{reviewing.phoneVerified}</DetailRow>
            <DetailRow label="Identity Verification">{reviewing.idDocVerified ?? "Not required"}</DetailRow>
            <DetailRow label="NIN">{reviewing.nin ?? "Not required"}</DetailRow>
            <DetailRow label="BVN">{reviewing.bvn ?? "Not required"}</DetailRow>
            <DetailRow label="Document Type">{reviewing.uploadedDocType ?? "Not required"}</DetailRow>
            <DetailRow label="Uploaded Document">{reviewing.uploadedDoc ?? "Not required"}</DetailRow>
          </DetailSection>

          <DetailSection title="Professional & payment details">
            <p className="text-[#626773] text-xs leading-[160%] font-normal">
              Not applicable to the User role. Work profile, portfolio, bank details and payout preferences are artisan only.
            </p>
          </DetailSection>

          <div className="flex items-center justify-between gap-3 pt-5">
            <Button onClick={noop} className={cn("py-5", TONE_STYLES.Suspend.chip)}>Suspend</Button>
            <Button onClick={noop} className={cn("py-5", TONE_STYLES.Disable.chip)}>Disable</Button>
          </div>
        </div>}
      </DetailSheet>
    </section>
  )
}

export default UserManagementIndex