"use client"

import { useMemo, useState } from "react"
import { Flag, Globe, Headset, Search } from "lucide-react"
import { cn } from "cn"
import EmptyState from "@/components/account/empty-state"
import { ListSkeleton } from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { TicketStatusBadge } from "@/components/account/support/ticket-parts"
import FormField from "@/components/form/form-field"
import { FilterTabs, type FilterTab } from "@/components/shared/filter-tabs"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import { useAdminSupport, useAdminSupportCounts } from "@/hooks/admin/use-support"
import { formatActivityDate } from "@/lib/format"
import type { SupportFilter, TicketForStaff } from "@/types/admin/support"
import TicketSheet from "./ticket-sheet"

const TABS: { value: SupportFilter, label: string }[] = [
  { value: "open", label: "Waiting on us" },
  { value: "mine", label: "Assigned to me" },
  { value: "waiting", label: "Waiting on them" },
  { value: "resolved", label: "Resolved" },
]

const EMPTY: Record<SupportFilter, string> = {
  open: "Nothing waiting. New requests from customers, artisans and the website appear here.",
  mine: "Nothing assigned to you.",
  waiting: "No requests waiting on a reply from the user.",
  resolved: "No resolved requests yet.",
}

const matches = (ticket: TicketForStaff, terms: string[]) => {
  const haystack = [ticket.reference, ticket.subject, ticket.contact.name, ticket.contact.email, ticket.category_label].join(" ").toLowerCase()
  return terms.every((term) => haystack.includes(term))
}

const TicketRow = ({ ticket, onOpen }: { ticket: TicketForStaff, onOpen: () => void }) => (
  <li>
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-start gap-3 rounded-xl px-2 py-3.5 text-left outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", ticket.unread ? "bg-hw-primary" : "bg-transparent")} aria-label={ticket.unread ? "Unread" : undefined} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={cn("text-sm text-hw-grey-900", ticket.unread ? "font-semibold" : "font-medium")}>{ticket.subject}</span>
          {ticket.priority === "HIGH" && <Flag className="size-3.5 text-[#C2271D]" aria-label="High priority" />}
          {ticket.source === "CONTACT_FORM" && <Globe className="size-3.5 text-hw-grey-500" aria-label="From the website" />}
        </span>
        <span className="truncate text-xs text-hw-grey-500">
          {ticket.contact.name} · {ticket.reference} · {ticket.category_label}
          {ticket.assigned_to ? ` · ${ticket.assigned_to.name}` : " · unassigned"}
        </span>
        {ticket.preview && (
          <span className="line-clamp-1 text-xs text-hw-grey-700">
            {ticket.preview.from_staff ? "You: " : ""}
            {ticket.preview.text}
          </span>
        )}
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <TicketStatusBadge status={ticket.status} viewer="staff" />
        <span className="text-[11px] text-hw-grey-500">{formatActivityDate(ticket.last_message_at)}</span>
      </span>
    </button>
  </li>
)

/** The team's inbox for help requests and website messages */
const SupportInboxIndex = () => {
  const heading = usePageHeading()
  const [status, setStatus] = useState<SupportFilter>("open")
  const [query, setQuery] = useState("")
  const [openId, setOpenId] = useState<number | null>(null)
  const list = useAdminSupport(status)
  const counts = useAdminSupportCounts()
  const tickets = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return (list.data ?? []).filter((ticket) => !terms.length || matches(ticket, terms))
  }, [list.data, query])
  const tabs: FilterTab<SupportFilter>[] = TABS.map((tab) => ({ ...tab, count: counts.data?.[tab.value] }))

  return (
    <section className="flex flex-col gap-6">
      <PageHeader title={heading?.title ?? "Support"} description={heading?.description ?? "Help requests."} action={null} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <FilterTabs label="Requests" tabs={tabs} value={status} onChange={setStatus} className="w-fit" />
        </div>
        <div className="w-full sm:w-80">
          <FormField
            name="support-search"
            label="Search"
            type="search"
            placeholder="Reference, subject, name or email"
            startAddon={<Search />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <SectionCard title={TABS.find(({ value }) => value === status)?.label ?? "Requests"}>
        {list.isPending ? (
          <ListSkeleton rows={5} />
        ) : list.isError ? (
          <EmptyState icon={Headset} title="Couldn't load support requests" description="Check your connection and try again." action={<Button onClick={() => list.refetch()}>Try again</Button>} />
        ) : tickets.length ? (
          <ul className="-mx-2 flex flex-col divide-y divide-hw-border">
            {tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} onOpen={() => setOpenId(ticket.id)} />)}
          </ul>
        ) : (
          <EmptyState icon={Headset} title={query.trim() ? "No matches" : "All clear"} description={query.trim() ? "No requests match your search." : EMPTY[status]} />
        )}
      </SectionCard>
      <TicketSheet ticketId={openId} onOpenChange={(open) => !open && setOpenId(null)} />
    </section>
  )
}

export default SupportInboxIndex
