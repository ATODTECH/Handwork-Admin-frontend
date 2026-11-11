"use client"

import Link from "next/link"
import BookingStatusBadge from "@/components/account/bookings/booking-status-badge"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { DetailRow, DetailSection } from "@/components/shared/details-part"
import { Button } from "@/components/ui/button"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import { TARGET_NOUNS } from "@/lib/reports"
import type { ReportForStaff, ReportPerson, ReportTargetDetails } from "@/types/admin/reports"
import { ReportStatusBadge } from "./columns"
import { elsewhere } from "./moderation"

const ROLE_LABELS: Record<string, string> = { USER: "Customer", ARTISAN: "Artisan" }

const Text = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[13px] leading-relaxed whitespace-pre-line text-[#626773]">{children}</p>
)

const Person = ({ title, person, children }: { title: string, person: ReportPerson | null, children?: React.ReactNode }) => (
  <DetailSection title={title}>
    {person ? (
      <>
        <DetailRow label="Name">{person.name}</DetailRow>
        <DetailRow label="Email">{person.email}</DetailRow>
        <DetailRow label="Role">{ROLE_LABELS[person.role] ?? person.role}</DetailRow>
        <DetailRow label="Account">{person.is_active ? "Active" : "Deactivated"}</DetailRow>
        {children}
      </>
    ) : (
      <Text>This account no longer exists.</Text>
    )}
  </DetailSection>
)

/** What was reported, as it is now */
const Target = ({ target }: { target: ReportTargetDetails }) => {
  switch (target.kind) {
    case "MESSAGE":
      return (
        <>
          <div className="rounded-xl bg-muted px-3.5 py-2.5"><Text>{target.text}</Text></div>
          <DetailRow label="Sent">{formatActivityDate(target.timestamp)}</DetailRow>
          <DetailRow label="In">{target.booking_id ? `Booking #${target.booking_id}'s chat` : `Request #${target.request_id}'s chat`}</DetailRow>
          {target.hidden && <DetailRow label="Status">Removed</DetailRow>}
        </>
      )
    case "REVIEW":
      return (
        <>
          <DetailRow label="Stars">{`${target.star} of 5`}</DetailRow>
          <Text>{target.message || "No written review."}</Text>
          {target.booking_id && <DetailRow label="Booking">#{target.booking_id}</DetailRow>}
          {target.hidden && <DetailRow label="Status">Hidden</DetailRow>}
        </>
      )
    case "OFFER":
      return (
        <>
          <DetailRow label="Request">{target.request_title}</DetailRow>
          <DetailRow label="Price">{formatNairaAmount(target.price)}</DetailRow>
          <DetailRow label="Status">{target.status.charAt(0) + target.status.slice(1).toLowerCase()}</DetailRow>
          <Text>{target.description}</Text>
        </>
      )
    case "REQUEST":
      return (
        <>
          <DetailRow label="Reference">{target.reference}</DetailRow>
          <DetailRow label="Title">{target.title}</DetailRow>
          <DetailRow label="Stage">{target.stage.replaceAll("_", " ").toLowerCase()}</DetailRow>
          <Text>{target.description}</Text>
        </>
      )
    case "BOOKING":
      return (
        <>
          <DetailRow label="Booking">#{target.id}</DetailRow>
          <DetailRow label="Services">{target.services.join(", ") || null}</DetailRow>
          <DetailRow label="Price">{target.agreed_amount && formatNairaAmount(target.agreed_amount)}</DetailRow>
          <div className="pt-1"><BookingStatusBadge status={target.status} viewer="staff" /></div>
        </>
      )
  }
}

interface ReportSheetProps {
  report: ReportForStaff | null
  onOpenChange: (open: boolean) => void
  onResolve: (report: ReportForStaff) => void
}

/** Everything staff need to judge one report */
const ReportSheet = ({ report, onOpenChange, onResolve }: ReportSheetProps) => {
  const otherPlace = report && elsewhere(report)

  return (
    <DetailSheet open={report !== null} onOpenChange={onOpenChange} title="Report">
      {report && (
        <div className="divide-y divide-hw-grey-200">
          <div className="flex flex-wrap items-start justify-between gap-3 pb-5">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-lg font-semibold text-hw-grey-900">{report.reason_label}</span>
              <span className="text-xs text-hw-grey-500">
                A {TARGET_NOUNS[report.target_type]} · reported {formatActivityDate(report.created_at)}
                {report.other_open_reports > 0 && ` · ${report.other_open_reports} more open about it`}
              </span>
            </div>
            <ReportStatusBadge status={report.status} />
          </div>

          <DetailSection title="What the reporter said">
            <Text>{report.details || "No details given."}</Text>
          </DetailSection>

          {report.target && (
            <DetailSection title={`The ${TARGET_NOUNS[report.target_type]}`}>
              <Target target={report.target} />
            </DetailSection>
          )}

          <Person title="Reported" person={report.reported_user}>
            {report.reported_user && (
              <DetailRow label="Reports about them">
                {`${report.reported_user.reports_received} in all, ${report.reported_user.reports_actioned} acted on`}
              </DetailRow>
            )}
          </Person>
          <Person title="Reporter" person={report.reporter} />

          {report.status !== "OPEN" && (
            <DetailSection title={`Settled by ${report.resolved_by ?? "staff"}`}>
              {report.resolved_at && <DetailRow label="When">{formatActivityDate(report.resolved_at)}</DetailRow>}
              <DetailRow label="Content removed">{report.content_hidden ? "Yes" : "No"}</DetailRow>
              <Text>{report.resolution_note}</Text>
            </DetailSection>
          )}

          {report.status === "OPEN" && (
            <div className="flex flex-col gap-3 pt-5">
              {otherPlace && (
                <p className="text-xs text-hw-grey-500">
                  {otherPlace.text}{" "}
                  <Link href={otherPlace.href} className="font-medium text-hw-primary underline-offset-4 hover:underline">{otherPlace.link}</Link>.
                </p>
              )}
              <Button className="w-full" onClick={() => onResolve(report)}>
                Settle this report
              </Button>
            </div>
          )}
        </div>
      )}
    </DetailSheet>
  )
}

export default ReportSheet
