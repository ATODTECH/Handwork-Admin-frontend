"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import ReviewCard from "@/components/account/reviews/review-card"
import ReviewSummary from "@/components/account/reviews/review-summary"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { useMyReviews } from "@/hooks/account/use-reviews"
import { reviewStats } from "@/lib/reviews"

type ReviewFilter = "all" | "unanswered"

/** What customers said about the provider's finished jobs, with their replies */
const ArtisanReviews = () => {
  const { data = [], isPending, isError, refetch } = useMyReviews()
  const [filter, setFilter] = useState<ReviewFilter>("all")
  const stats = reviewStats(data)
  const shown = filter === "unanswered" ? data.filter(({ reply }) => !reply) : data

  return (
    <>
      <PageHeader
        title="Reviews"
        description="Customers can review a job once you've been paid for it. Replies show under the review for everyone to see."
      />
      <QueryContent
        isPending={isPending}
        isError={isError}
        onRetry={refetch}
        isEmpty={!data.length}
        empty={
          <SectionCard title="Your reviews">
            <EmptyState
              icon={Star}
              title="No reviews yet"
              description="Once a customer confirms a job and you're paid, they can leave a review. Good reviews help you win more offers."
            />
          </SectionCard>
        }
      >
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <SectionCard title="Your rating" description="Customers see this on your profile and your offers." className="lg:sticky lg:top-24">
            <ReviewSummary stats={stats} />
          </SectionCard>

          <SectionCard title="What customers said" contentClassName="flex flex-col gap-5">
            <FilterTabs
              label="Show reviews"
              value={filter}
              onChange={setFilter}
              tabs={[
                { label: "All", value: "all", count: data.length },
                { label: "Needs a reply", value: "unanswered", count: stats.unanswered },
              ]}
            />
            {shown.length ? (
              <div className="flex flex-col divide-y divide-hw-grey-200">
                {shown.map((review) => (
                  <ReviewCard key={review.id} review={review} canReply reportable className="py-5 first:pt-0 last:pb-0" />
                ))}
              </div>
            ) : (
              <EmptyState icon={Star} title="All caught up" description="You've replied to every review." />
            )}
          </SectionCard>
        </div>
      </QueryContent>
    </>
  )
}

export default ArtisanReviews
