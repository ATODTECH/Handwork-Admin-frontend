"use client"

import { Fragment, useState } from "react"
import { cn } from "cn"
import { Flag } from "lucide-react"
import { ReportDialog } from "@/components/account/reports/report-dialog"
import { dayKey, formatActivityDay, formatTime } from "@/lib/format"
import type { ChatMessage } from "@/types/account/messages"

interface MessageTimelineProps {
  messages: ChatMessage[]
  /** Messages on the right, e.g. the viewer's own, or the artisan's for staff */
  isOwn: (message: ChatMessage) => boolean
  /** Name each message's sender (staff see both sides) */
  showSender?: boolean
  /** Offer "Report" under the other person's messages */
  reportable?: boolean
}

/** Chat bubbles with a divider for each day */
const MessageTimeline = ({ messages, isOwn, showSender = false, reportable = false }: MessageTimelineProps) => {
  const [reporting, setReporting] = useState<ChatMessage | null>(null)

  return (
    <>
      <ol className="flex flex-col gap-2">
        {messages.map((message, index) => {
          const own = isOwn(message)
          const newDay = index === 0 || dayKey(messages[index - 1].timestamp) !== dayKey(message.timestamp)

          return (
            <Fragment key={message.id}>
              {newDay && (
                <li className="my-2 flex justify-center" aria-hidden>
                  <span className="rounded-full bg-hw-grey-200/60 px-3 py-1 text-[11px] font-medium text-hw-grey-700">
                    {formatActivityDay(message.timestamp)}
                  </span>
                </li>
              )}
              <li className={cn("flex flex-col gap-1", own ? "items-end" : "items-start")}>
                {showSender && <span className="px-1 text-[11px] font-medium text-hw-grey-500">{message.sender_name}</span>}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word",
                    own ? "rounded-br-md bg-secondary-blue text-white" : "rounded-bl-md bg-hw-grey-200/50 text-hw-grey-900",
                  )}
                >
                  {message.text}
                </div>
                <span className="flex items-center gap-2 px-1">
                  <time dateTime={message.timestamp} className="text-[11px] text-hw-grey-500 tabular-nums">
                    {formatTime(message.timestamp)}
                  </time>
                  {reportable && !own && !message.hidden && (
                    <button
                      type="button"
                      onClick={() => setReporting(message)}
                      className="inline-flex items-center gap-1 rounded text-[11px] text-hw-grey-500 outline-none hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`Report this message from ${message.sender_name}`}
                    >
                      <Flag className="size-3" />
                      Report
                    </button>
                  )}
                </span>
              </li>
            </Fragment>
          )
        })}
      </ol>
      {reporting && (
        <ReportDialog
          open
          onOpenChange={(open) => !open && setReporting(null)}
          target={{ type: "MESSAGE", id: reporting.id }}
          subject={`this message from ${reporting.sender_name.split(" ")[0]}`}
        />
      )}
    </>
  )
}

export default MessageTimeline
