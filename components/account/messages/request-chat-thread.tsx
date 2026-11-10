"use client"

import { useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import type { BookingViewer } from "@/components/account/bookings/booking-status-badge"
import ChatPanel from "@/components/account/requests/chat-panel"
import { UseAvatar } from "@/components/shared/use-avatar"
import { Button } from "@/components/ui/button"
import { useMarkProviderThreadRead, useProviderThread, useSendProviderMessage } from "@/hooks/account/use-provider-requests"
import { useMarkRequestThreadRead, useRequestThread, useSendRequestMessage } from "@/hooks/account/use-requests"
import { artisanRequestRoute, customerRequestRoute } from "@/lib/routes"
import type { RequestConversation } from "@/types/account/messages"

interface RequestChatThreadProps {
  conversation: RequestConversation
  viewer: BookingViewer
  onBack: () => void
}

interface ThreadBodyProps {
  conversation: RequestConversation
  emptyText: string
}

/** The customer's side: they name the provider of the conversation */
const CustomerThread = ({ conversation, emptyText }: ThreadBodyProps) => {
  const { request_id: requestId, provider_id: providerId } = conversation
  const thread = useRequestThread(requestId, providerId, true)
  const send = useSendRequestMessage()
  const { mutate: markRead, isPending: marking } = useMarkRequestThreadRead()
  const onUnread = useCallback(() => {
    if (!marking) markRead({ requestId, providerId })
  }, [marking, markRead, requestId, providerId])

  return (
    <ChatPanel
      className="flex-1 px-4 pb-3"
      thread={thread.data}
      isPending={thread.isPending}
      isError={thread.isError}
      onRetry={thread.refetch}
      onSend={(text, done) => send.mutate({ requestId, providerId, text }, { onSuccess: done })}
      sending={send.isPending}
      sendError={send.error?.message ?? null}
      onUnread={onUnread}
      emptyText={emptyText}
    />
  )
}

/** The provider's side: the conversation is always their own */
const ProviderThread = ({ conversation, emptyText }: ThreadBodyProps) => {
  const requestId = conversation.request_id
  const thread = useProviderThread(requestId, true)
  const send = useSendProviderMessage()
  const { mutate: markRead, isPending: marking } = useMarkProviderThreadRead()
  const onUnread = useCallback(() => {
    if (!marking) markRead(requestId)
  }, [marking, markRead, requestId])

  return (
    <ChatPanel
      className="flex-1 px-4 pb-3"
      thread={thread.data}
      isPending={thread.isPending}
      isError={thread.isError}
      onRetry={thread.refetch}
      onSend={(text, done) => send.mutate({ requestId, text }, { onSuccess: done })}
      sending={send.isPending}
      sendError={send.error?.message ?? null}
      onUnread={onUnread}
      emptyText={emptyText}
    />
  )
}

/** A conversation about a request, before an offer is accepted, inside Messages */
const RequestChatThread = ({ conversation, viewer, onBack }: RequestChatThreadProps) => {
  const isCustomer = viewer === "customer"
  const firstName = conversation.with.name.split(" ")[0]
  const requestHref = isCustomer ? customerRequestRoute(conversation.request_id) : artisanRequestRoute(conversation.request_id)
  const emptyText = isCustomer ? `Ask ${firstName} about their offer.` : `Ask ${firstName} about the job.`

  return (
    <section className="flex h-full min-h-0 flex-col" aria-label={`Conversation with ${conversation.with.name}`}>
      <header className="flex items-center gap-3 border-b border-hw-grey-200 px-4 py-3">
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onBack} aria-label="Back to conversations">
          <ArrowLeft />
        </Button>
        <UseAvatar src={conversation.with.profile_image ?? ""} name={conversation.with.name} aspectRatio="size-10" className="text-sm" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-hw-grey-900">{conversation.with.name}</span>
          <span className="truncate text-xs text-hw-grey-500">
            {isCustomer ? "Your request" : "Request"}: {conversation.request_title}
          </span>
        </div>
        <Button variant="outline" size="sm" render={<Link href={requestHref} />} nativeButton={false}>
          <ExternalLink data-icon="inline-start" />
          <span className="hidden sm:inline">{isCustomer ? "See offers" : "See request"}</span>
        </Button>
      </header>
      {isCustomer ? (
        <CustomerThread conversation={conversation} emptyText={emptyText} />
      ) : (
        <ProviderThread conversation={conversation} emptyText={emptyText} />
      )}
    </section>
  )
}

export default RequestChatThread
