import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { formatActivityDate } from "@/lib/format"
import { SEMANTIC_TONES, type SemanticTone } from "@/lib/tones"
import type { TicketCategory, TicketMessage, TicketStatus } from "@/types/account/support"

export const TICKET_CATEGORIES: { value: TicketCategory, label: string }[] = [
  { value: "PAYMENT", label: "Payments and refunds" },
  { value: "BOOKING", label: "A booking" },
  { value: "REQUEST", label: "Requests and offers" },
  { value: "ACCOUNT", label: "My account" },
  { value: "VERIFICATION", label: "Artisan verification" },
  { value: "OTHER", label: "Something else" },
]

/** The same status reads differently for the person asking and for our team */
const STATUS: Record<TicketStatus, { user: string, staff: string, tone: SemanticTone }> = {
  OPEN: { user: "With our team", staff: "Waiting on us", tone: "warning" },
  WAITING: { user: "Replied", staff: "Waiting on them", tone: "info" },
  RESOLVED: { user: "Resolved", staff: "Resolved", tone: "success" },
}

export const TicketStatusBadge = ({ status, viewer, className }: { status: TicketStatus, viewer: "user" | "staff", className?: string }) => (
  <Badge className={cn(SEMANTIC_TONES[STATUS[status].tone].chip, className)}>{STATUS[status][viewer]}</Badge>
)

/** The conversation: the viewer's side on the right */
export const TicketThread = ({ messages, viewer }: { messages: TicketMessage[], viewer: "user" | "staff" }) => (
  <ol className="flex flex-col gap-3">
    {messages.map((message) => {
      const mine = viewer === "staff" ? message.from_staff : !message.from_staff
      return (
        <li key={message.id} className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
          <span className="px-1 text-[11px] font-medium text-hw-grey-500">
            {message.author_name} · {formatActivityDate(message.created_at)}
          </span>
          <div
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word",
              mine ? "rounded-br-md bg-secondary-blue text-white" : "rounded-bl-md bg-hw-grey-200/50 text-hw-grey-900",
            )}
          >
            {message.text}
          </div>
        </li>
      )
    })}
  </ol>
)
