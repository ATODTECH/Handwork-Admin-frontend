"use client"

import { useState } from "react"
import { Search, SearchX } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useArtisans, useCategories } from "@/hooks/account/use-marketplace"
import { NIGERIAN_STATES } from "@/lib/locations"
import { filterArtisans, hasFilters, NO_FILTERS, type ArtisanFilters } from "@/lib/marketplace"
import ArtisanCard from "./artisan-card"

const STATE_OPTIONS = NIGERIAN_STATES.map((state) => ({ value: state, label: state }))

const ResultsSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading">
    {Array.from({ length: 6 }, (_, i) => (
      <Skeleton key={i} className="h-80 rounded-2xl" />
    ))}
  </div>
)

/** Browse approved artisans by name, service, category and state */
const FindArtisan = ({ initialCategory }: { initialCategory?: string }) => {
  const artisans = useArtisans()
  const categories = useCategories()
  const [filters, setFilters] = useState<ArtisanFilters>({ ...NO_FILTERS, category: initialCategory ?? null })
  const update = (patch: Partial<ArtisanFilters>) => setFilters((current) => ({ ...current, ...patch }))

  const results = filterArtisans(artisans.data ?? [], categories.data ?? [], filters)
  const filtered = hasFilters(filters)
  const categoryOptions = (categories.data ?? []).map(({ name }) => ({ value: name, label: name }))

  return (
    <>
      <PageHeader title="Find an artisan" description="Every artisan here has been checked by our team. Pick one to see their work and book them." />

      <div className="grid gap-4 rounded-2xl bg-white p-4 ring-1 ring-hw-border sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="sm:col-span-2 lg:col-span-1">
          <FormField
            name="artisan-search"
            label="Search"
            type="search"
            placeholder="Name, service or area, e.g. tailor Ikeja"
            startAddon={<Search />}
            value={filters.query}
            onChange={(event) => update({ query: event.target.value })}
          />
        </div>
        <ComboboxField
          name="artisan-category"
          label="Category"
          placeholder={categories.isPending ? "Loading…" : "All categories"}
          disabled={categories.isPending || categories.isError}
          options={categoryOptions}
          value={filters.category}
          onValueChange={(category) => update({ category })}
        />
        <ComboboxField
          name="artisan-state"
          label="State"
          placeholder="All states"
          options={STATE_OPTIONS}
          value={filters.state}
          onValueChange={(state) => update({ state })}
        />
      </div>

      <QueryContent
        isPending={artisans.isPending}
        isError={artisans.isError}
        onRetry={artisans.refetch}
        isEmpty={!results.length}
        skeleton={<ResultsSkeleton />}
        empty={
          <EmptyState
            icon={SearchX}
            title={filtered ? "No artisans match your search" : "No artisans yet"}
            description={filtered ? "Try another service or area, or clear the filters." : "Verified artisans will appear here as soon as they're approved."}
            action={
              filtered && (
                <Button variant="outline" onClick={() => setFilters(NO_FILTERS)}>
                  Clear filters
                </Button>
              )
            }
          />
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-hw-grey-500" aria-live="polite">
            {results.length} {results.length === 1 ? "artisan" : "artisans"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </div>
      </QueryContent>
    </>
  )
}

export default FindArtisan
