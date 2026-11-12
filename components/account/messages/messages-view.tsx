"use client"

import { useState } from "react"
import Link from "next/link"
import { MessagesSquare } from "lucide-react"
import { cn } from "cn"
import type { BookingViewer } from "@/components/account/bookings/booking-status-badge"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent, { ListSkeleton } from "@/components/account/query-content"
import { Button } from "@/components/ui/button"
import { useConversations } from "@/hooks/account/use-messages"
import { ACCOUNT_ROUTES, messagesRoute } from "@/lib/routes"
import ChatThread from "./chat-thread"
import ConversationList, { conversationKey } from "./conversation-list"
import RequestChatThread from "./request-chat-thread"

interface MessagesViewProps {
  viewer: BookingViewer
  /** From `?booking=` or `?chat=`, e.g. the booking details' Message button */
  initialKey?: string
}

/** Conversations on the left, the open one on the right; one at a time on small screens */
const MessagesView = ({ viewer, initialKey }: MessagesViewProps) => {
  const conversations = useConversations()
  const [selectedKey, setSelectedKey] = useState<string | null>(initialKey ?? null)
  const selected = conversations.data?.find((conversation) => conversationKey(conversation) === selectedKey) ?? null

  const select = (key: string | null) => {
    setSelectedKey(key)
    // Keep the URL shareable without a navigation
    window.history.replaceState(null, "", messagesRoute(viewer, key ?? undefined))
  }

  const isCustomer = viewer === "customer"

  return (
    <>
      <PageHeader
        title="Messages"
        description={
          isCustomer
            ? "Talk to artisans about your requests and bookings. Each has its own conversation."
            : "Talk to customers about their requests and your jobs. Each has its own conversation."
        }
      />

      <QueryContent
        isPending={conversations.isPending}
        isError={conversations.isError}
        onRetry={conversations.refetch}
        isEmpty={!conversations.data?.length}
        skeleton={<ListSkeleton rows={4} />}
        empty={
          <EmptyState
            icon={MessagesSquare}
            title="No conversations yet"
            description={
              isCustomer
                ? "When an artisan sends you an offer or a question, or you book one, you can message them here."
                : "Ask a customer about their request, or message them about a job you're booked for."
            }
            action={
              isCustomer && (
                <Button render={<Link href={ACCOUNT_ROUTES.customerArtisans} />} nativeButton={false}>
                  Find an artisan
                </Button>
              )
            }
          />
        }
      >
        <div className="grid h-[calc(100dvh-13rem)] min-h-112 overflow-hidden rounded-2xl bg-white ring-1 ring-hw-border lg:grid-cols-[22rem_minmax(0,1fr)]">
          <div className={cn("min-h-0 overflow-y-auto border-hw-grey-200 scrollbar-thin lg:border-r", selected && "hidden lg:block")}>
            <ConversationList conversations={conversations.data ?? []} selectedKey={selectedKey} onSelect={select} />
          </div>
          <div className={cn("min-h-0", !selected && "hidden lg:block")}>
            {selected ? (
              // key: start each conversation fresh (draft, socket, scroll)
              selected.kind === "booking" ? (
                <ChatThread key={selectedKey} conversation={selected} viewer={viewer} onBack={() => select(null)} />
              ) : (
                <RequestChatThread key={selectedKey} conversation={selected} viewer={viewer} onBack={() => select(null)} />
              )
            ) : (
              <EmptyState
                icon={MessagesSquare}
                title="Pick a conversation"
                description="Choose a conversation on the left to see its messages."
                className="h-full rounded-none border-0 bg-transparent"
              />
            )}
          </div>
        </div>
      </QueryContent>
    </>
  )
}

export default MessagesView
