"use client"

import MessageTimeline from "@/components/account/messages/message-timeline"
import QueryContent from "@/components/account/query-content"
import { DetailSection } from "@/components/shared/details-part"
import { useAdminBookingMessages } from "@/hooks/admin/use-bookings"

/** The customer and artisan's chat, read-only: the artisan's messages on the right */
const BookingMessages = ({ bookingId }: { bookingId: number }) => {
  const messages = useAdminBookingMessages(bookingId)

  return (
    <DetailSection title="Messages">
      <QueryContent
        isPending={messages.isPending}
        isError={messages.isError}
        onRetry={messages.refetch}
        isEmpty={!messages.data?.length}
        empty={<p className="text-xs text-hw-grey-500">They haven&apos;t messaged each other on this booking.</p>}
      >
        <div className="max-h-96 overflow-y-auto rounded-xl bg-hw-grey-200/15 p-3 scrollbar-thin">
          <MessageTimeline messages={messages.data ?? []} isOwn={({ sender_role }) => sender_role === "ARTISAN"} showSender />
        </div>
      </QueryContent>
    </DetailSection>
  )
}

export default BookingMessages
