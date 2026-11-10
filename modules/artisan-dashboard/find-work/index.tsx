"use client"

import { useDeferredValue, useState } from "react"
import { Search, SearchX, ShieldCheck } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCategories } from "@/hooks/account/use-marketplace"
import { useRequestFeed } from "@/hooks/account/use-provider-requests"
import { isApiError } from "@/lib/http/errors"
import { NIGERIAN_STATES } from "@/lib/locations"
import RequestCard from "./request-card"

type Scope = "mine" | "all" | "saved"

const SCOPES = [
  { value: "mine", label: "For your services" },
  { value: "all", label: "All requests" },
  { value: "saved", label: "Saved" },
] as const

// Select can't hold an empty value, so "no filter" travels as this
const ANY = "any"

/** Open requests from customers, for providers to send offers on */
const FindWork = () => {
  const [scope, setScope] = useState<Scope>("mine")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(ANY)
  const [state, setState] = useState(ANY)
  // Don't refetch on every keystroke
  const term = useDeferredValue(search)
  const { data: categories = [] } = useCategories()

  const feed = useRequestFeed({
    all: scope === "all",
    saved: scope === "saved",
    category: category === ANY ? undefined : Number(category),
    state: state === ANY ? undefined : state,
    search: term,
  })
  // The API refuses providers staff haven't approved yet
  const notApproved = feed.isError && isApiError(feed.error) && feed.error.status === 403
  const filtered = !!term.trim() || category !== ANY || state !== ANY

  const categoryItems = [{ value: ANY, label: "All categories" }, ...categories.map(({ id, name }) => ({ value: String(id), label: name }))]
  const stateItems = [{ value: ANY, label: "All states" }, ...NIGERIAN_STATES.map((name) => ({ value: name, label: name }))]

  return (
    <>
      <PageHeader title="Find work" description="Customers describe what they need. Send an offer with your price and timing." />
      {notApproved ? (
        <EmptyState
          icon={ShieldCheck}
          title="Requests open up once you're approved"
          description="Our team is reviewing your account. You'll be able to see customers' requests and send offers as soon as you're approved."
        />
      ) : (
        <SectionCard title="Open requests" contentClassName="flex flex-col gap-5">
          <FilterTabs<Scope> label="Which requests" tabs={SCOPES} value={scope} onChange={setScope} />
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_12rem]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-hw-grey-500" />
              <Input
                type="search"
                aria-label="Search requests"
                placeholder="Search titles and descriptions"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 pl-9"
              />
            </div>
            <Select items={categoryItems} value={category} onValueChange={(next) => setCategory((next as string | null) ?? ANY)}>
              <SelectTrigger aria-label="Category" className="h-10! w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="max-h-72">
                {categoryItems.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select items={stateItems} value={state} onValueChange={(next) => setState((next as string | null) ?? ANY)}>
              <SelectTrigger aria-label="State" className="h-10! w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="max-h-72">
                {stateItems.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <QueryContent
            isPending={feed.isPending}
            isError={feed.isError}
            onRetry={feed.refetch}
            isEmpty={!feed.data?.length}
            empty={
              <EmptyState
                icon={SearchX}
                title={scope === "saved" ? "Nothing saved yet" : filtered ? "No requests match" : "No open requests right now"}
                description={
                  scope === "saved"
                    ? "Save a request to come back to it before you send an offer."
                    : filtered
                      ? "Try another search, category or state."
                      : scope === "mine"
                        ? "We'll let you know when a customer posts a request for a service you offer. You can also look at all requests."
                        : "Check back soon."
                }
              />
            }
          >
            <ul className="flex flex-col gap-3">
              {feed.data?.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </ul>
          </QueryContent>
        </SectionCard>
      )}
    </>
  )
}

export default FindWork
