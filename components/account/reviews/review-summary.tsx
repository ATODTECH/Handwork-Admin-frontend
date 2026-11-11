import { formatCount } from "@/lib/format"
import { reviewCountLabel, type ReviewStats } from "@/lib/reviews"
import { Stars } from "./stars"

/** The average and how the stars spread, from verified reviews */
const ReviewSummary = ({ stats }: { stats: ReviewStats }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center gap-4">
      <span className="text-4xl font-semibold tracking-tight text-hw-grey-900 tabular-nums">
        {stats.average === null ? "–" : stats.average.toFixed(1)}
      </span>
      <div className="flex flex-col gap-1">
        <Stars value={stats.average ?? 0} className="[&_svg]:size-4" />
        <span className="text-xs text-hw-grey-500">
          {stats.count ? `From ${reviewCountLabel(stats.count)} of paid jobs` : "No reviews of paid jobs yet"}
        </span>
      </div>
    </div>
    <ul className="flex flex-col gap-2" aria-label="Reviews by stars">
      {stats.byStar.map(({ star, count }) => (
        <li key={star} className="flex items-center gap-3 text-xs text-hw-grey-700">
          <span className="w-12 shrink-0">{star} {star === 1 ? "star" : "stars"}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <span className="block h-full rounded-full bg-[#F3A218]" style={{ width: stats.count ? `${(count / stats.count) * 100}%` : 0 }} />
          </span>
          <span className="w-6 shrink-0 text-right tabular-nums">{formatCount(count)}</span>
        </li>
      ))}
    </ul>
  </div>
)

export default ReviewSummary
