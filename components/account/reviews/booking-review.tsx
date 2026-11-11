"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { DetailSection } from "@/components/shared/details-part"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useReview } from "@/hooks/account/use-reviews"
import { bookingTitle } from "@/lib/bookings"
import { canEditReview, REVIEW_EDIT_DAYS } from "@/lib/reviews"
import type { Booking } from "@/types/account/dashboard"
import ReviewCard from "./review-card"
import ReviewDialog from "./review-dialog"

/** The customer's review of a booking, in its Details panel: they can edit it, the provider can reply */
const BookingReview = ({ booking, viewer }: { booking: Booking, viewer: "customer" | "artisan" }) => {
  const { data: review, isPending, isError } = useReview(booking.review?.id)
  const [editing, setEditing] = useState(false)
  if (!booking.review) return null
  const isCustomer = viewer === "customer"
  const editable = isCustomer && review && canEditReview(review)

  return (
    <DetailSection title={isCustomer ? "Your review" : "The customer's review"}>
      {isPending ? (
        <Skeleton className="h-20 rounded-xl" />
      ) : isError || !review ? (
        <p className="text-[13px] text-hw-grey-500">We couldn&apos;t load the review. Try again later.</p>
      ) : (
        <>
          <ReviewCard
            review={review}
            compact={isCustomer}
            canReply={!isCustomer}
            actions={
              editable && (
                <Button variant="ghost" size="sm" className="h-7" onClick={() => setEditing(true)}>
                  <Pencil data-icon="inline-start" />
                  Edit
                </Button>
              )
            }
          />
          {isCustomer && !editable && (
            <p className="pt-2 text-xs text-hw-grey-500">
              {review.reply ? "The provider has replied, so your review can't be changed." : `Reviews can be changed for ${REVIEW_EDIT_DAYS} days.`}
            </p>
          )}
          {editable && (
            <ReviewDialog
              open={editing}
              onOpenChange={setEditing}
              providerName={booking.artisan.split(" ")[0] || booking.artisan}
              jobTitle={bookingTitle(booking)}
              review={review}
            />
          )}
        </>
      )}
    </DetailSection>
  )
}

export default BookingReview
