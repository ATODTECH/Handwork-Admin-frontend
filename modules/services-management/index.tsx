"use client"

import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import SubmitButton from "@/components/form/submit-button"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/table-data/data-table"
import { DataTablePagination } from "@/components/table-data/data-table-pagination"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAdminCategories, useAdminServices, useDeleteService, useUpdateService } from "@/hooks/admin/use-services"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import type { AdminService } from "@/types/admin/services"
import { serviceColumns } from "./columns"
import ServiceDialog from "./service-dialog"

const PAGE_SIZE = 15

/** The catalogue artisans choose from. Hiding keeps what's already in use; only unused services can be deleted */
const ServicesIndex = () => {
  const heading = usePageHeading()
  const services = useAdminServices()
  const categories = useAdminCategories()
  const toggle = useUpdateService()
  const remove = useDeleteService()

  const [query, setQuery] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<{ service: AdminService | null } | null>(null)
  const [deleting, setDeleting] = useState<AdminService | null>(null)

  const categoryList = useMemo(() => categories.data ?? [], [categories.data])

  const columns = useMemo(
    () =>
      serviceColumns({
        categoryNames: (service) =>
          categoryList.filter(({ id }) => service.categories.includes(id)).map(({ name }) => name).join(", "),
        onEdit: (service) => setEditing({ service }),
        onToggle: ({ id, name, active }) =>
          toggle.mutate({ id, active: !active }, { onSuccess: () => toast.success(active ? `${name} is hidden.` : `${name} is offered again.`) }),
        onDelete: setDeleting,
      }),
    // `toggle.mutate` is stable; the rest only depends on the category names
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoryList],
  )

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return (services.data ?? []).filter((service) => {
      if (categoryId !== null && !service.categories.includes(categoryId)) return false
      const haystack = `${service.name} ${service.description}`.toLowerCase()
      return terms.every((term) => haystack.includes(term))
    })
  }, [services.data, query, categoryId])

  const lastPage = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)
  const pageRows = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title={heading?.title ?? "Services"}
        description={heading?.description ?? "The services artisans can offer."}
        action={
          <Button onClick={() => setEditing({ service: null })} disabled={categories.isPending || categories.isError}>
            <Plus data-icon="inline-start" />
            Add a service
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <FormField
          name="service-search"
          label="Search"
          type="search"
          placeholder="Service name or description"
          startAddon={<Search />}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
        />
        <ComboboxField
          name="service-category"
          label="Category"
          placeholder={categories.isPending ? "Loading…" : "All categories"}
          disabled={categories.isPending || categories.isError}
          options={categoryList.map(({ id, name }) => ({ value: id, label: name }))}
          value={categoryId}
          onValueChange={(next) => {
            setCategoryId(next)
            setPage(1)
          }}
        />
      </div>

      <DataTable
        label="Services"
        columns={columns}
        data={pageRows}
        getRowId={(row) => String(row.id)}
        isLoading={services.isPending}
        isRefreshing={services.isFetching && !services.isPending}
        error={services.error}
        onRetry={() => services.refetch()}
        isRetrying={services.isRefetching}
        skeletonRows={8}
        emptyMessage={query.trim() || categoryId !== null ? "No services match your search." : "No services yet."}
        className="rounded-xl bg-hw-base-white"
        footer={
          results.length > PAGE_SIZE && (
            <DataTablePagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={results.length}
              onPageChange={setPage}
              noun={{ one: "service", other: "services" }}
            />
          )
        }
      />

      <ServiceDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        service={editing?.service ?? null}
        categories={categoryList}
      />

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {deleting?.name}?</DialogTitle>
            <DialogDescription>No artisans or bookings use this service. This can&apos;t be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={remove.isPending}>Keep it</Button>
            <SubmitButton
              type="button"
              variant="destructive"
              size="default"
              pending={remove.isPending}
              pendingText="Deleting…"
              onClick={() => {
                if (!deleting) return
                const { id, name } = deleting
                remove.mutate(id, {
                  onSuccess: () => toast.success(`${name} has been deleted.`),
                  onSettled: () => setDeleting(null),
                })
              }}
            >
              Delete service
            </SubmitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default ServicesIndex
