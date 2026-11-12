"use client"

import { useEffect, useState } from "react"
import { CircleCheckBig, LifeBuoy, Plus, SendHorizontal } from "lucide-react"
import { cn } from "cn"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useQueryClient } from "@tanstack/react-query"
import { useReplyTicket, useResolveTicket, useTicket, useTickets } from "@/hooks/account/use-support"
import { formatActivityDate } from "@/lib/format"
import { queryKeys } from "@/lib/query/keys"
import type { SupportTicket } from "@/types/account/support"
import NewTicketDialog from "./new-ticket-dialog"
import { TicketStatusBadge, TicketThread } from "./ticket-parts"

const MAX_REPLY = 4000

const ReplyBox = ({ ticket }: { ticket: SupportTicket }) => {
  const reply = useReplyTicket()
  const [text, setText] = useState("")
  const send = () => {
    if (!text.trim() || reply.isPending) return
    reply.mutate({ id: ticket.id, text: text.trim() }, { onSuccess: () => setText("") })
  }
  return (
    <form
      className="flex flex-col gap-2 border-t border-hw-grey-200 pt-4"
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
    >
      <Textarea
        aria-label="Your reply"
        placeholder={ticket.status === "RESOLVED" ? "Need more help? Replying opens this again." : "Write a reply"}
        value={text}
        maxLength={MAX_REPLY}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) send()
        }}
        className="min-h-24"
        disabled={reply.isPending}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!text.trim() || reply.isPending}>
          {reply.isPending ? <Spinner data-icon="inline-start" /> : <SendHorizontal data-icon="inline-start" />}
          Send
        </Button>
      </div>
    </form>
  )
}

const TicketDetails = ({ id }: { id: number }) => {
  const { data: ticket, isPending, isError, refetch } = useTicket(id)
  const resolve = useResolveTicket()
  const queryClient = useQueryClient()

  // Opening it marks replies as read on the API; refresh the list and the menu badge to match
  const loaded = !!ticket
  useEffect(() => {
    if (!loaded) return
    void queryClient.invalidateQueries({ queryKey: queryKeys.account.ticketsUnread() })
    void queryClient.invalidateQueries({ queryKey: queryKeys.account.tickets(), exact: true })
  }, [loaded, id, queryClient])

  if (isPending) return <Skeleton className="h-64 rounded-xl" />
  if (isError || !ticket) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm text-hw-grey-500">We couldn&apos;t load this request.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Try again</Button>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-hw-grey-900">{ticket.subject}</h3>
          <TicketStatusBadge status={ticket.status} viewer="user" />
        </div>
        <p className="text-xs text-hw-grey-500">
          {ticket.reference} · {ticket.category_label}
          {ticket.booking && ` · booking #${ticket.booking}`} · opened {formatActivityDate(ticket.created_at)}
        </p>
      </div>
      <TicketThread messages={ticket.messages ?? []} viewer="user" />
      <ReplyBox ticket={ticket} />
      {ticket.status !== "RESOLVED" && (
        <Button variant="ghost" size="sm" className="w-fit text-hw-grey-700" disabled={resolve.isPending} onClick={() => resolve.mutate(ticket.id)}>
          <CircleCheckBig data-icon="inline-start" />
          My problem is solved
        </Button>
      )}
    </div>
  )
}

const TicketRow = ({ ticket, onOpen }: { ticket: SupportTicket, onOpen: () => void }) => (
  <li>
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", ticket.unread ? "bg-hw-primary" : "bg-transparent")} aria-label={ticket.unread ? "New reply" : undefined} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={cn("truncate text-sm text-hw-grey-900", ticket.unread ? "font-semibold" : "font-medium")}>{ticket.subject}</span>
        <span className="truncate text-xs text-hw-grey-500">
          {ticket.reference} · {ticket.category_label} · {formatActivityDate(ticket.last_message_at)}
        </span>
      </span>
      <TicketStatusBadge status={ticket.status} viewer="user" className="shrink-0" />
    </button>
  </li>
)

/** Help & support for customers and artisans: their requests to our team, and a way to open a new one */
const SupportPage = () => {
  const { data = [], isPending, isError, refetch } = useTickets()
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<number | null>(null)
  const active = data.filter(({ status }) => status !== "RESOLVED")
  const resolved = data.filter(({ status }) => status === "RESOLVED")

  return (
    <>
      <PageHeader
        title="Help & support"
        description="Questions about a booking, a payment or your account? Ask our team here."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus data-icon="inline-start" />
            New request
          </Button>
        }
      />
      <QueryContent
        isPending={isPending}
        isError={isError}
        onRetry={refetch}
        isEmpty={!data.length}
        empty={
          <EmptyState
            icon={LifeBuoy}
            title="No support requests yet"
            description="If something isn't working or you have a question, send us a request and we'll reply here."
            action={<Button onClick={() => setCreating(true)}>Ask for help</Button>}
          />
        }
      >
        <div className="flex flex-col gap-6">
          {active.length > 0 && (
            <SectionCard title="Open">
              <ul className="-mx-2 flex flex-col">
                {active.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} onOpen={() => setOpenId(ticket.id)} />)}
              </ul>
            </SectionCard>
          )}
          {resolved.length > 0 && (
            <SectionCard title="Resolved">
              <ul className="-mx-2 flex flex-col">
                {resolved.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} onOpen={() => setOpenId(ticket.id)} />)}
              </ul>
            </SectionCard>
          )}
        </div>
      </QueryContent>
      <NewTicketDialog open={creating} onOpenChange={setCreating} onCreated={(ticket) => setOpenId(ticket.id)} />
      <DetailSheet open={openId !== null} onOpenChange={(open) => !open && setOpenId(null)} title="Support request">
        {openId !== null && <TicketDetails id={openId} />}
      </DetailSheet>
    </>
  )
}

export default SupportPage
