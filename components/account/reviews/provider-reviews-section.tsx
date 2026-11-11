"use client"

import { useState } from "react"
import SectionCard from "@/components/account/section-card"
import { ListSkeleton } from "@/components/account/query-content"
import { Button } from "@/components/ui/button"
import { useProviderReviews } from "@/hooks/account/use-reviews"
import { reviewStats } from "@/lib/reviews"
import ReviewCard from "./review-card"
import ReviewSummary from "./review-summary"

const FIRST_PAGE = 5

/** A provider's reviews on their public profile; hidden while there are none */
const ProviderReviewsSection = ({ providerId }: { providerId: string }) => {
  const { data = [], isPending } = useProviderReviews(providerId)
  const [showAll, setShowAll] = useState(false)
  if (isPending) return <SectionCard title="Reviews"><ListSkeleton rows={2} /></SectionCard>
  if (!data.length) return null
  const shown = showAll ? data : data.slice(0, FIRST_PAGE)

  return (
    <SectionCard title="Reviews" description="Only customers who paid for a job through Handwork Expert can review it.">
      <div className="flex flex-col gap-6">
        <ReviewSummary stats={reviewStats(data)} />
        <div className="flex flex-col divide-y divide-hw-grey-200 border-t border-hw-grey-200">
          {shown.map((review) => (
            <ReviewCard key={review.id} review={review} className="py-5 last:pb-0" />
          ))}
        </div>
        {data.length > FIRST_PAGE && (
          <Button variant="outline" className="w-fit" onClick={() => setShowAll((all) => !all)}>
            {showAll ? "Show fewer" : `Show all ${data.length} reviews`}
          </Button>
        )}
      </div>
    </SectionCard>
  )
}

export default ProviderReviewsSection
