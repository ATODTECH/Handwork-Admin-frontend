"use client"

import { cn } from "cn"
import SectionCard from "@/components/account/section-card"
import { Badge } from "@/components/ui/badge"
import { useMyReports } from "@/hooks/account/use-reports"
import { formatActivityDate } from "@/lib/format"
import { TARGET_NOUNS } from "@/lib/reports"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { ReportStatus } from "@/types/account/reports"

/** How a report's outcome reads to the person who sent it (staff notes stay private) */
const OUTCOME: Record<ReportStatus, { label: string, tone: "warning" | "success" | "neutral" }> = {
  OPEN: { label: "Being looked at", tone: "warning" },
  ACTIONED: { label: "We took action", tone: "success" },
  DISMISSED: { label: "Nothing against our rules", tone: "neutral" },
}

/** Reports this person sent about accounts, requests, offers, messages, bookings or reviews; hidden while there are none */
const MyReports = () => {
  const { data = [] } = useMyReports()
  if (!data.length) return null
  return (
    <SectionCard title="Your reports" description="What you've reported to our team, and what happened. We never tell anyone who reported them.">
      <ul className="flex flex-col divide-y divide-hw-border">
        {data.map((report) => (
          <li key={report.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium text-hw-grey-900">
                {report.reason_label}
                <span className="font-normal text-hw-grey-500"> · {TARGET_NOUNS[report.target_type]}</span>
              </span>
              {report.details && <span className="line-clamp-1 text-xs text-hw-grey-700">{report.details}</span>}
              <span className="text-xs text-hw-grey-500">
                Sent {formatActivityDate(report.created_at)}
                {report.resolved_at && ` · settled ${formatActivityDate(report.resolved_at)}`}
              </span>
            </div>
            <Badge className={cn("shrink-0", SEMANTIC_TONES[OUTCOME[report.status].tone].chip)}>{OUTCOME[report.status].label}</Badge>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

export default MyReports
