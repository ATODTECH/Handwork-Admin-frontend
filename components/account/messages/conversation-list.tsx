import { Lock } from "lucide-react"
import { cn } from "cn"
import { UseAvatar } from "@/components/shared/use-avatar"
import { formatActivityDay, formatTime, dayKey } from "@/lib/format"
import type { Conversation } from "@/types/account/messages"

export const conversationTitle = ({ services }: Pick<Conversation, "services">) => services.join(", ") || "Service request"

/** "3:05 pm" today, otherwise the day */
const lastActivity = ({ last_message, created_at }: Conversation) => {
  const iso = last_message?.timestamp ?? created_at
  return dayKey(iso) === dayKey(new Date().toISOString()) ? formatTime(iso) : formatActivityDay(iso)
}

const preview = ({ last_message, can_send }: Conversation) => {
  if (last_message) return `${last_message.mine ? "You: " : ""}${last_message.text}`
  return can_send ? "No messages yet. Say hello." : "No messages"
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: number | null
  onSelect: (bookingId: number) => void
}

/** One row per booking, most recent activity first */
const ConversationList = ({ conversations, selectedId, onSelect }: ConversationListProps) => (
  <ul className="flex flex-col divide-y divide-hw-grey-200" aria-label="Conversations">
    {conversations.map((conversation) => {
      const selected = conversation.booking_id === selectedId
      const unread = conversation.unread > 0

      return (
        <li key={conversation.booking_id}>
          <button
            type="button"
            onClick={() => onSelect(conversation.booking_id)}
            aria-current={selected || undefined}
            className={cn(
              "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors outline-none hover:bg-hw-grey-200/30 focus-visible:bg-hw-grey-200/40",
              selected && "bg-[#FEF1ED] hover:bg-[#FEF1ED]",
            )}
          >
            <UseAvatar src={conversation.with.profile_image ?? ""} name={conversation.with.name} aspectRatio="size-10" className="text-sm" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className={cn("truncate text-sm text-hw-grey-900", unread ? "font-semibold" : "font-medium")}>
                  {conversation.with.name}
                </span>
                <span className="shrink-0 text-xs text-hw-grey-500 tabular-nums">{lastActivity(conversation)}</span>
              </div>
              <span className="truncate text-xs text-hw-grey-500">{conversationTitle(conversation)}</span>
              <div className="flex items-center justify-between gap-2">
                <span className={cn("truncate text-[13px]", unread ? "font-medium text-hw-grey-900" : "text-hw-grey-500")}>
                  {preview(conversation)}
                </span>
                {unread ? (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-hw-primary px-1.5 text-[11px] font-semibold text-white tabular-nums">
                    <span className="sr-only">Unread messages: </span>
                    {conversation.unread}
                  </span>
                ) : (
                  !conversation.can_send && <Lock className="size-3.5 shrink-0 text-hw-grey-500" aria-label="Read-only" />
                )}
              </div>
            </div>
          </button>
        </li>
      )
    })}
  </ul>
)

export default ConversationList
