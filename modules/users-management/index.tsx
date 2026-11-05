"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import FormField from "@/components/form/form-field"
import { FilterTabs, type FilterTab } from "@/components/shared/filter-tabs"
import { PageHeader } from "@/components/shared/page-header"
import ReasonDialog from "@/components/shared/reason-dialog"
import { DataTable } from "@/components/table-data/data-table"
import { DataTablePagination } from "@/components/table-data/data-table-pagination"
import { Button } from "@/components/ui/button"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import { useAdminUserCounts, useAdminUsers, useDeactivateUser } from "@/hooks/admin/use-users"
import { formatNairaAmount } from "@/lib/format"
import { ROUTES } from "@/lib/routes"
import type { AdminUser, UserFilter } from "@/types/admin/users"
import { userColumns } from "./columns"
import UserSheet from "./user-sheet"

const PAGE_SIZE = 10

const TABS: { value: UserFilter, label: string }[] = [
  { value: "customers", label: "Customers" },
  { value: "artisans", label: "Artisans" },
  { value: "staff", label: "Staff" },
  { value: "deactivated", label: "Deactivated" },
]

const EMPTY: Record<UserFilter, string> = {
  customers: "No customers yet.",
  artisans: "No artisans yet.",
  staff: "No staff accounts.",
  deactivated: "No deactivated accounts.",
}

const QUICK_REASONS = [
  "We received reports of misconduct on this account.",
  "The details on this account look false.",
  "This account broke our terms of use.",
]

const matchesSearch = (user: AdminUser, terms: string[]) => {
  const haystack = [user.name, user.email, user.contact, user.city, user.state].filter(Boolean).join(" ").toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

/** What's still going on with the account, so staff know what they'd be interrupting */
const deactivateWarning = ({ open_bookings, wallet_balance }: AdminUser) => {
  const warnings = []
  if (open_bookings) warnings.push(`${open_bookings} open ${open_bookings === 1 ? "booking stays" : "bookings stay"} as they are`)
  if (Number(wallet_balance) > 0) warnings.push(`${formatNairaAmount(wallet_balance)} stays in their wallet`)
  return warnings.length ? ` Note: ${warnings.join(", and ")}.` : ""
}

/** Every account by type. Staff can deactivate an account and undo it later */
const UserManagementIndex = () => {
  const heading = usePageHeading()
  const [status, setStatus] = useState<UserFilter>("customers")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [deactivating, setDeactivating] = useState<AdminUser | null>(null)

  const list = useAdminUsers(status)
  const counts = useAdminUserCounts()
  const { mutate: deactivate, isPending } = useDeactivateUser()

  const users = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return (list.data ?? []).filter((user) => matchesSearch(user, terms))
  }, [list.data, query])
  const viewing = list.data?.find(({ id }) => id === viewingId) ?? null
  const columns = useMemo(() => userColumns(({ id }) => setViewingId(id)), [])
  const tabs: FilterTab<UserFilter>[] = TABS.map((tab) => ({ ...tab, count: counts.data?.[tab.value] }))

  const lastPage = Math.max(1, Math.ceil(users.length / PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)
  const pageRows = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={heading?.title ?? "User Management"}
        description={heading?.description ?? "Every customer, artisan and staff account."}
        action={
          <Button variant="outline" render={<Link href={ROUTES.artisans} />} nativeButton={false}>
            Review artisans
          </Button>
        }
      />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="-mx-1 max-w-full overflow-x-auto px-1 pb-1">
          <FilterTabs
            label="Account type"
            tabs={tabs}
            value={status}
            onChange={(next) => {
              setStatus(next)
              setPage(1)
            }}
            className="w-fit"
          />
        </div>
        <div className="w-full sm:w-80">
          <FormField
            name="user-search"
            label="Search"
            type="search"
            placeholder="Name, email, phone or area"
            startAddon={<Search />}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
          />
        </div>
      </div>

      <DataTable
        label="Users"
        columns={columns}
        data={pageRows}
        getRowId={(row) => row.id}
        isLoading={list.isPending}
        isRefreshing={list.isFetching && !list.isPending}
        error={list.error}
        onRetry={() => list.refetch()}
        isRetrying={list.isRefetching}
        skeletonRows={5}
        emptyMessage={query.trim() ? "Nobody matches your search." : EMPTY[status]}
        className="rounded-xl bg-hw-base-white"
        footer={
          users.length > PAGE_SIZE && (
            <DataTablePagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={users.length}
              onPageChange={setPage}
              noun={{ one: "user", other: "users" }}
            />
          )
        }
      />

      <UserSheet user={viewing} onOpenChange={(open) => !open && setViewingId(null)} onDeactivate={setDeactivating} />

      <ReasonDialog
        open={deactivating !== null}
        onOpenChange={(open) => !open && setDeactivating(null)}
        title={`Deactivate ${deactivating?.name ?? "this account"}?`}
        description={`They won't be able to sign in, and we'll email them this reason. You can undo this later.${deactivating ? deactivateWarning(deactivating) : ""}`}
        quickReasons={QUICK_REASONS}
        placeholder="Why is this account being deactivated?"
        submitLabel="Deactivate account"
        pending={isPending}
        onSubmit={(reason, done) => {
          if (!deactivating) return
          deactivate(
            { id: deactivating.id, reason },
            {
              onSuccess: () => {
                done()
                setViewingId(null)
              },
            },
          )
        }}
      />
    </section>
  )
}

export default UserManagementIndex
