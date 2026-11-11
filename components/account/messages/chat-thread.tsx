"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, Lock, MessageSquareText, SendHorizontal } from "lucide-react"
import BookingStatusBadge, { type BookingViewer } from "@/components/account/bookings/booking-status-badge"
import EmptyState from "@/components/account/empty-state"
import QueryContent from "@/components/account/query-content"
import { UseAvatar } from "@/components/shared/use-avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useChatMessages, useChatSocket, useMarkMessagesRead, useSendMessage } from "@/hooks/account/use-messages"
import { accountSession } from "@/lib/auth/session"
import type { BookingConversation } from "@/types/account/messages"
import { conversationTitle } from "./conversation-list"
import MessageTimeline from "./message-timeline"

/** Matches the API's limit */
const MAX_LENGTH = 2000

const ThreadSkeleton = () => (
  <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading">
    <Skeleton className="h-10 w-2/3 rounded-2xl" />
    <Skeleton className="ml-auto h-10 w-1/2 rounded-2xl" />
    <Skeleton className="h-14 w-3/5 rounded-2xl" />
  </div>
)

interface ChatThreadProps {
  conversation: BookingConversation
  viewer: BookingViewer
  /** Small screens show the list or the thread; this goes back to the list */
  onBack: () => void
}

/** One booking's conversation: history, live updates and the message box */
const ChatThread = ({ conversation, viewer, onBack }: ChatThreadProps) => {
  const bookingId = conversation.booking_id
  const live = useChatSocket(bookingId, true)
  const messages = useChatMessages(bookingId, live)
  const send = useSendMessage()
  const markRead = useMarkMessagesRead()
  const [draft, setDraft] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const myId = accountSession.getUserId()

  const list = messages.data ?? []
  const hasUnread = list.some((message) => message.sender !== myId && !message.is_read)

  // Reading the conversation marks the other person's messages as read
  const { mutate: markAsRead, isPending: marking } = markRead
  useEffect(() => {
    if (hasUnread && !marking) markAsRead(bookingId)
  }, [bookingId, hasUnread, marking, markAsRead])

  // Keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" })
  }, [list.length, bookingId])

  const text = draft.trim()
  const submit = () => {
    if (!text || send.isPending) return
    send.mutate({ bookingId, text }, { onSuccess: () => setDraft("") })
  }

  return (
    <section className="flex h-full min-h-0 flex-col" aria-label={`Conversation with ${conversation.with.name}`}>
      <header className="flex items-center gap-3 border-b border-hw-grey-200 px-4 py-3">
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onBack} aria-label="Back to conversations">
          <ArrowLeft />
        </Button>
        <UseAvatar src={conversation.with.profile_image ?? ""} name={conversation.with.name} aspectRatio="size-10" className="text-sm" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-hw-grey-900">{conversation.with.name}</span>
          <span className="truncate text-xs text-hw-grey-500">{conversationTitle(conversation)}</span>
        </div>
        <BookingStatusBadge status={conversation.status} viewer={viewer} className="hidden sm:inline-flex" />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
        <QueryContent
          isPending={messages.isPending}
          isError={messages.isError}
          onRetry={messages.refetch}
          isEmpty={!list.length}
          skeleton={<ThreadSkeleton />}
          empty={
            <EmptyState
              icon={MessageSquareText}
              title="No messages yet"
              description={
                conversation.can_send
                  ? `Ask ${conversation.with.name.split(" ")[0]} anything about this job.`
                  : "Nobody sent a message on this booking."
              }
              className="border-0 bg-transparent"
            />
          }
        >
          <MessageTimeline messages={list} isOwn={(message) => message.sender === myId} reportable />
        </QueryContent>
        <div ref={bottomRef} />
      </div>

      {conversation.can_send ? (
        <form
          className="flex flex-col gap-1.5 border-t border-hw-grey-200 p-3"
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          {send.isError && (
            <p role="alert" className="px-1 text-xs text-destructive">
              {send.error.message}
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
            <Button type="submit" size="icon-lg" disabled={!text || send.isPending} aria-label="Send message">
              {send.isPending ? <Spinner /> : <SendHorizontal />}
            </Button>
          </div>
          {draft.length > MAX_LENGTH - 200 && (
            <span className="px-1 text-right text-[11px] text-hw-grey-500 tabular-nums">
              {draft.length} / {MAX_LENGTH}
            </span>
          )}
        </form>
      ) : (
        <p className="flex items-center justify-center gap-2 border-t border-hw-grey-200 px-4 py-3.5 text-center text-xs text-hw-grey-500">
          <Lock className="size-3.5 shrink-0" />
          This booking is closed, so you can read the messages but not send new ones.
        </p>
      )}
    </section>
  )
}

export default ChatThread
