"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CircleCheckBig, Flag, RotateCcw, SendHorizontal } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { TicketStatusBadge, TicketThread } from "@/components/account/support/ticket-parts"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { DetailRow, DetailSection } from "@/components/shared/details-part"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useStaffList } from "@/hooks/admin/use-staff"
import { useAdminSupportTicket, useAssignSupport, useReplySupport, useUpdateSupport } from "@/hooks/admin/use-support"
import { formatActivityDate } from "@/lib/format"
import { queryKeys } from "@/lib/query/keys"
import { ROUTES } from "@/lib/routes"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { TicketForStaff } from "@/types/admin/support"

const MAX_REPLY = 4000
const UNASSIGNED = "unassigned"
const ROLE_LABELS: Record<string, string> = { USER: "Customer", ARTISAN: "Artisan" }

const StaffReplyBox = ({ ticket }: { ticket: TicketForStaff }) => {
  const reply = useReplySupport()
  const [text, setText] = useState("")
  const [then, setThen] = useState<"WAITING" | "RESOLVED">("WAITING")
  const send = (next: "WAITING" | "RESOLVED") => {
    if (!text.trim() || reply.isPending) return
    setThen(next)
    reply.mutate({ id: ticket.id, text: text.trim(), then: next }, { onSuccess: () => setText("") })
  }
  return (
    <div className="flex flex-col gap-2 border-t border-hw-grey-200 pt-4">
      <Textarea
        aria-label="Reply"
        placeholder={`Reply to ${ticket.contact.name.split(" ")[0]}. They get it ${ticket.contact.user ? "in the app and " : ""}by email.`}
        value={text}
        maxLength={MAX_REPLY}
        onChange={(event) => setText(event.target.value)}
        className="min-h-28"
        disabled={reply.isPending}
      />
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" disabled={!text.trim() || reply.isPending} onClick={() => send("RESOLVED")}>
          {reply.isPending && then === "RESOLVED" ? <Spinner data-icon="inline-start" /> : <CircleCheckBig data-icon="inline-start" />}
          Send and resolve
        </Button>
        <Button disabled={!text.trim() || reply.isPending} onClick={() => send("WAITING")}>
          {reply.isPending && then === "WAITING" ? <Spinner data-icon="inline-start" /> : <SendHorizontal data-icon="inline-start" />}
          Send reply
        </Button>
      </div>
    </div>
  )
}

const Details = ({ ticket }: { ticket: TicketForStaff }) => {
  const { data: staff = [] } = useStaffList()
  const assign = useAssignSupport()
  const update = useUpdateSupport()
  const active = staff.filter(({ is_active }) => is_active)
  const assignItems = [{ value: UNASSIGNED, label: "Nobody" }, ...active.map((member) => ({ value: member.id, label: `${member.first_name} ${member.last_name}`.trim() || member.email }))]

  return (
    <div className="divide-y divide-hw-grey-200">
      <div className="flex flex-col gap-2 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span className="text-lg font-semibold text-hw-grey-900">{ticket.subject}</span>
          <TicketStatusBadge status={ticket.status} viewer="staff" />
        </div>
        <span className="text-xs text-hw-grey-500">
          {ticket.reference} · {ticket.category_label} · {ticket.source === "CONTACT_FORM" ? "website contact form" : "from their dashboard"} · opened{" "}
          {formatActivityDate(ticket.created_at)}
        </span>
        {ticket.priority === "HIGH" && <Badge className={`${SEMANTIC_TONES.danger.chip} w-fit`}><Flag /> High priority</Badge>}
      </div>

      <div className="flex flex-col gap-4 py-5">
        <TicketThread messages={ticket.messages ?? []} viewer="staff" />
        <StaffReplyBox ticket={ticket} />
      </div>

      <DetailSection title="Who asked">
        <DetailRow label="Name">{ticket.contact.name}</DetailRow>
        <DetailRow label="Email">{ticket.contact.email || null}</DetailRow>
        <DetailRow label="Phone">{ticket.contact.phone || null}</DetailRow>
        <DetailRow label="Account">{ticket.contact.user ? ROLE_LABELS[ticket.contact.user.role] ?? ticket.contact.user.role : "No account (website visitor)"}</DetailRow>
        {ticket.booking && (
          <DetailRow label="Booking">
            <Link href={ROUTES.bookings} className="font-medium text-hw-primary underline-offset-4 hover:underline">#{ticket.booking}</Link>
          </DetailRow>
        )}
      </DetailSection>

      <DetailSection title="Handling">
        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between gap-3 text-[13px] text-hw-grey-900">
            <span className="font-medium">Assigned to</span>
            <Select
              items={assignItems}
              value={ticket.assigned_to?.id ?? UNASSIGNED}
              onValueChange={(next) => assign.mutate({ id: ticket.id, staff: next === UNASSIGNED ? null : String(next) })}
            >
              <SelectTrigger className="h-9 w-48" aria-label="Assigned to">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assignItems.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={update.isPending}
              onClick={() => update.mutate({ id: ticket.id, priority: ticket.priority === "HIGH" ? "NORMAL" : "HIGH" })}
            >
              <Flag data-icon="inline-start" />
              {ticket.priority === "HIGH" ? "Set to normal priority" : "Mark high priority"}
            </Button>
            {ticket.status === "RESOLVED" ? (
              <Button variant="outline" size="sm" disabled={update.isPending} onClick={() => update.mutate({ id: ticket.id, status: "OPEN" })}>
                <RotateCcw data-icon="inline-start" />
                Reopen
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled={update.isPending} onClick={() => update.mutate({ id: ticket.id, status: "RESOLVED" })}>
                <CircleCheckBig data-icon="inline-start" />
                Resolve without replying
              </Button>
            )}
          </div>
        </div>
      </DetailSection>
    </div>
  )
}

/** One support request: the conversation, the reply box and who's handling it */
const TicketSheet = ({ ticketId, onOpenChange }: { ticketId: number | null, onOpenChange: (open: boolean) => void }) => {
  const { data, isPending, isError, refetch } = useAdminSupportTicket(ticketId)
  const queryClient = useQueryClient()
  // Opening it marks it read for staff; refresh the inbox's unread dots and counts
  const loaded = !!data
  useEffect(() => {
    if (loaded) void queryClient.invalidateQueries({ queryKey: queryKeys.admin.supportRoot(), predicate: (query) => query.queryKey[2] !== "ticket" })
  }, [loaded, ticketId, queryClient])

  return (
    <DetailSheet open={ticketId !== null} onOpenChange={onOpenChange} title="Support request">
      {ticketId !== null &&
        (isPending ? (
          <Skeleton className="h-80 rounded-xl" />
        ) : isError || !data ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-hw-grey-500">We couldn&apos;t load this request.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>Try again</Button>
          </div>
        ) : (
          <Details ticket={data} />
        ))}
    </DetailSheet>
  )
}

export default TicketSheet
