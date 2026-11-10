"use client"

import { useEffect, useRef, useState } from "react"
import { Lock, MessageSquareText, SendHorizontal } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import MessageTimeline from "@/components/account/messages/message-timeline"
import QueryContent from "@/components/account/query-content"
import { UseAvatar } from "@/components/shared/use-avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useMarkRequestThreadRead, useRequestThread, useSendRequestMessage } from "@/hooks/account/use-requests"
import { accountSession } from "@/lib/auth/session"
import type { OfferProvider } from "@/types/account/requests"

/** Matches the API's limit */
const MAX_LENGTH = 2000

interface RequestChatSheetProps {
  requestId: number
  requestTitle: string
  provider: OfferProvider | null
  onOpenChange: (open: boolean) => void
}

/** The customer's chat with one provider about a request, before an offer is accepted */
const RequestChatSheet = ({ requestId, requestTitle, provider, onOpenChange }: RequestChatSheetProps) => {
  const open = provider !== null
  const thread = useRequestThread(requestId, provider?.id ?? "", open)
  const send = useSendRequestMessage()
  const { mutate: markRead, isPending: marking } = useMarkRequestThreadRead()
  const [draft, setDraft] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const myId = accountSession.getUserId()
  const messages = thread.data?.messages ?? []
  const canSend = thread.data?.can_send ?? false
  const hasUnread = messages.some((message) => message.sender !== myId && !message.is_read)

  useEffect(() => {
    if (provider && hasUnread && !marking) markRead({ requestId, providerId: provider.id })
  }, [provider, hasUnread, marking, markRead, requestId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" })
  }, [messages.length])

  const text = draft.trim()
  const submit = () => {
    if (!provider || !text || send.isPending) return
    send.mutate({ requestId, providerId: provider.id, text }, { onSuccess: () => setDraft("") })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        {provider && (
          <>
            <SheetHeader className="flex-row items-center gap-3 border-b border-hw-grey-200 px-5 py-4">
              <UseAvatar src={provider.profile_image ?? ""} name={provider.name} aspectRatio="size-10" className="text-sm" />
              <div className="flex min-w-0 flex-col">
                <SheetTitle className="truncate text-base">{provider.name}</SheetTitle>
                <SheetDescription className="truncate">{requestTitle}</SheetDescription>
              </div>
            </SheetHeader>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
              <QueryContent
                isPending={thread.isPending}
                isError={thread.isError}
                onRetry={thread.refetch}
                isEmpty={!messages.length}
                empty={
                  <EmptyState
                    icon={MessageSquareText}
                    title="No messages yet"
                    description={`Ask ${provider.name.split(" ")[0]} about their offer before you decide.`}
                    className="border-0 bg-transparent"
                  />
                }
              >
                <MessageTimeline messages={messages} isOwn={(message) => message.sender === myId} />
              </QueryContent>
              <div ref={bottomRef} />
            </div>

            {canSend ? (
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
                <p className="px-1 text-[11px] text-hw-grey-500">
                  Keep payments on Handwork Expert: we only protect money paid here.
                </p>
              </form>
            ) : (
              !thread.isPending && (
                <p className="flex items-center justify-center gap-2 border-t border-hw-grey-200 px-4 py-3.5 text-center text-xs text-hw-grey-500">
                  <Lock className="size-3.5 shrink-0" />
                  This request isn&apos;t taking offers any more, so the chat is read-only.
                </p>
              )
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default RequestChatSheet
