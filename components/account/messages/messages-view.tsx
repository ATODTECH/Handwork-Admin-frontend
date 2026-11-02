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
import ConversationList from "./conversation-list"

interface MessagesViewProps {
  viewer: BookingViewer
  /** From `?booking=`, e.g. the booking details' Message button */
  initialBookingId?: number
}

/** Conversations on the left, the open one on the right; one at a time on small screens */
const MessagesView = ({ viewer, initialBookingId }: MessagesViewProps) => {
  const conversations = useConversations()
  const [selectedId, setSelectedId] = useState<number | null>(initialBookingId ?? null)
  const selected = conversations.data?.find(({ booking_id }) => booking_id === selectedId) ?? null

  const select = (bookingId: number | null) => {
    setSelectedId(bookingId)
    // Keep the URL shareable without a navigation
    window.history.replaceState(null, "", messagesRoute(viewer, bookingId ?? undefined))
  }

  const isCustomer = viewer === "customer"

  return (
    <>
      <PageHeader
        title="Messages"
        description={
          isCustomer
            ? "Talk to the artisans you've booked. Each booking has its own conversation."
            : "Talk to your customers. Each job has its own conversation."
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
                ? "Once you book an artisan, you can message them here about the job."
                : "When a customer books you, you can message them here about the job."
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
            <ConversationList conversations={conversations.data ?? []} selectedId={selectedId} onSelect={select} />
          </div>
          <div className={cn("min-h-0", !selected && "hidden lg:block")}>
            {selected ? (
              // key: start each conversation fresh (draft, socket, scroll)
              <ChatThread key={selected.booking_id} conversation={selected} viewer={viewer} onBack={() => select(null)} />
            ) : (
              <EmptyState
                icon={MessagesSquare}
                title="Pick a conversation"
                description="Choose a booking on the left to see its messages."
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
