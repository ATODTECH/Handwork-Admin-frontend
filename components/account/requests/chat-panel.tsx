"use client"

import { useEffect, useRef, useState } from "react"
import { Lock, MessageSquareText, SendHorizontal } from "lucide-react"
import { cn } from "cn"
import EmptyState from "@/components/account/empty-state"
import MessageTimeline from "@/components/account/messages/message-timeline"
import QueryContent from "@/components/account/query-content"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { accountSession } from "@/lib/auth/session"
import type { RequestThread } from "@/types/account/requests"

/** Matches the API's limit */
const MAX_LENGTH = 2000

interface ChatPanelProps {
  thread: RequestThread | undefined
  isPending: boolean
  isError: boolean
  onRetry: () => void
  /** Call `done` once sent, so the box clears */
  onSend: (text: string, done: () => void) => void
  sending: boolean
  sendError: string | null
  /** Called while the other person's messages are unread */
  onUnread: () => void
  emptyText: string
  className?: string
}

/** A request chat (before an offer is accepted): history, the message box, or a read-only note */
const ChatPanel = ({ thread, isPending, isError, onRetry, onSend, sending, sendError, onUnread, emptyText, className }: ChatPanelProps) => {
  const [draft, setDraft] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const myId = accountSession.getUserId()
  const messages = thread?.messages ?? []
  const hasUnread = messages.some((message) => message.sender !== myId && !message.is_read)

  useEffect(() => {
    if (hasUnread) onUnread()
  }, [hasUnread, onUnread])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" })
  }, [messages.length])

  const text = draft.trim()
  const submit = () => {
    if (!text || sending) return
    onSend(text, () => setDraft(""))
  }

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-2 scrollbar-thin">
        <QueryContent
          isPending={isPending}
          isError={isError}
          onRetry={onRetry}
          isEmpty={!messages.length}
          empty={<EmptyState icon={MessageSquareText} title="No messages yet" description={emptyText} className="border-0 bg-transparent" />}
        >
          <MessageTimeline messages={messages} isOwn={(message) => message.sender === myId} />
        </QueryContent>
        <div ref={bottomRef} />
      </div>

      {thread?.can_send ? (
        <form
          className="flex flex-col gap-1.5 border-t border-hw-grey-200 pt-3"
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          {sendError && (
            <p role="alert" className="px-1 text-xs text-destructive">
              {sendError}
            </p>
          )}
          <div className="flex items-end gap-2">
            <Textarea
              name="message"
              aria-label="Message"
              placeholder="Write a message"
              rows={1}
              maxLength={MAX_LENGTH}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                // Enter sends; Shift+Enter adds a new line
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  submit()
                }
              }}
              className="max-h-36 min-h-10 resize-none"
            />
            <Button type="submit" size="icon-lg" disabled={!text || sending} aria-label="Send message">
              {sending ? <Spinner /> : <SendHorizontal />}
            </Button>
          </div>
          <p className="px-1 text-[11px] text-hw-grey-500">Keep payments on Handwork Expert: we only protect money paid here.</p>
        </form>
      ) : (
        thread && (
          <p className="flex items-center justify-center gap-2 border-t border-hw-grey-200 pt-3.5 text-center text-xs text-hw-grey-500">
            <Lock className="size-3.5 shrink-0" />
            This request isn&apos;t taking offers any more, so the chat is read-only.
          </p>
        )
      )}
    </div>
  )
}

export default ChatPanel
