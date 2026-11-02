"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, SearchX } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import QueryContent from "@/components/account/query-content"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import ArtisanCard from "@/components/shared/artisan-card"
import { JoinNetwork } from "@/components/site/join-network"
import { Pagination } from "@/components/site/pagination"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useArtisans, useCategories } from "@/hooks/account/use-marketplace"
import { NIGERIAN_STATES } from "@/lib/locations"
import { filterArtisans } from "@/lib/marketplace"

const PAGE_SIZE = 9

const STATE_OPTIONS = NIGERIAN_STATES.map((state) => ({ value: state, label: state }))

const ResultsSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
    {Array.from({ length: 6 }, (_, i) => (
      <Skeleton key={i} className="h-80 rounded-2xl bg-white" />
    ))}
  </div>
)

/** Approved artisans offering any service in one category, for visitors; booking signs them in first */
export const CategoryDetailsIndex = ({ id, category }: { id: string, category: string }) => {
  const artisans = useArtisans()
  const categories = useCategories()
  const [query, setQuery] = useState("")
  const [serviceId, setServiceId] = useState<number | null>(null)
  const [state, setState] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const services = categories.data?.find(({ name }) => name.toLowerCase() === category.toLowerCase())?.service ?? []
  const serviceOptions = services.map(({ id: value, name: label }) => ({ value, label }))

  const inCategory = filterArtisans(artisans.data ?? [], categories.data ?? [], { query, category, state })
  const results = serviceId ? inCategory.filter(({ skill }) => skill?.services.some(({ id }) => id === serviceId)) : inCategory
  const filtered = query.trim() !== "" || !!serviceId || !!state

  const totalPages = Math.ceil(results.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const visible = results.slice(start, start + PAGE_SIZE)

  // Any filter change starts again from the first page
  const filterBy = <T,>(set: (value: T) => void) => (value: T) => {
    set(value)
    setPage(1)
  }

  const clearFilters = () => {
    setQuery("")
    setServiceId(null)
    setState(null)
    setPage(1)
  }

  return (
    <section className="w-full flex flex-col items-center relative">
      <div className="flex flex-col w-full items-center">
        <div className="flex items-center justify-between w-[90%] md:w-full pt-36 px-4 p-16 sm:px-16 xl:px-28 gap-4">
          <h1 className="font-semibold leading-relaxed text-start text-xl 425xl:text-2xl sm:text-4xl lg:leading-14 tracking-[2%]">{category}</h1>
          <span className="flex flex-nowrap text-base font-medium text-[#858585] select-none">{id} / categories </span>
        </div>

        <div className="w-full flex flex-col gap-6 relative px-4 p-16 sm:px-16 xl:px-28 bg-[#F9F7F7]">
          <div className="grid gap-4 rounded-2xl bg-white p-4 ring-1 ring-hw-border sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div className="sm:col-span-2 lg:col-span-1">
              <FormField
                name="category-search"
                label="Search"
                type="search"
                placeholder="Name or area, e.g. Ikeja"
                startAddon={<Search />}
                value={query}
                onChange={(event) => filterBy(setQuery)(event.target.value)}
              />
            </div>
            <ComboboxField
              name="category-service"
              label="Service"
              placeholder={categories.isPending ? "Loading…" : "All services"}
              disabled={categories.isPending || categories.isError}
              options={serviceOptions}
              value={serviceId}
              onValueChange={filterBy(setServiceId)}
            />
            <ComboboxField
              name="category-state"
              label="State"
              placeholder="All states"
              options={STATE_OPTIONS}
              value={state}
              onValueChange={filterBy(setState)}
            />
          </div>

          <QueryContent
            isPending={artisans.isPending || categories.isPending}
            isError={artisans.isError || categories.isError}
            onRetry={() => {
              void artisans.refetch()
              void categories.refetch()
            }}
            isEmpty={!results.length}
            skeleton={<ResultsSkeleton />}
            empty={
              <EmptyState
                icon={SearchX}
                title={filtered ? "No artisans match your search" : `No ${category} artisans yet`}
                description={
                  filtered
                    ? "Try another service or area, or clear the filters."
                    : "We're checking new artisans all the time. Have a look at another category in the meantime."
                }
                action={
                  filtered ? (
                    <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
                  ) : (
                    <Button variant="outline" render={<Link href="/categories" />} nativeButton={false}>All categories</Button>
                  )
                }
              />
            }
          >
            <div className="flex flex-col gap-4">
              <p className="text-sm text-hw-grey-500" aria-live="polite">
                {results.length} verified {results.length === 1 ? "artisan" : "artisans"}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((artisan) => (
                  <ArtisanCard key={artisan.id} artisan={artisan} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex w-full justify-center pt-12">
                  <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </div>
              )}
            </div>
          </QueryContent>
        </div>

        <JoinNetwork className="my-16 pt-36 px-4 p-16 sm:px-16 xl:px-28" />
      </div>
    </section>
  )
}
