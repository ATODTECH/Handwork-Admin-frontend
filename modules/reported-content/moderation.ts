import { ROUTES } from "@/lib/routes"
import type { ReportForStaff } from "@/types/admin/reports"

/** Request stages that can still be closed by staff (the API refuses once there's a booking) */
const CLOSABLE_STAGES = ["DRAFT", "PUBLISHED", "RECEIVING_OFFERS", "EXPIRED"]

/** What "remove" does to this report's target, or null when staff must act elsewhere or it's already gone */
export const removalLabel = ({ target, content_hidden }: ReportForStaff): string | null => {
  if (!target || content_hidden) return null
  switch (target.kind) {
    case "MESSAGE":
      return target.hidden ? null : "Remove the message (both sides see “This message was removed by our team”)"
    case "REVIEW":
      return target.hidden ? null : "Hide the review from the artisan's profile"
    case "OFFER":
      return target.status === "SUBMITTED" ? "Withdraw the offer" : null
    case "REQUEST":
      return CLOSABLE_STAGES.includes(target.stage) ? "Close the request and turn down its offers" : null
    default:
      return null
  }
}

/** Where staff act when the report can't be settled by hiding something */
export const elsewhere = ({ target_type, target }: ReportForStaff): { text: string, href: string, link: string } | null => {
  if (target_type === "USER") return { text: "To stop this account, deactivate it on", href: ROUTES.users, link: "User management" }
  if (target_type === "BOOKING") return { text: "To refund or pay out, use", href: ROUTES.bookings, link: "Bookings" }
  if (target?.kind === "OFFER" && target.status === "ACCEPTED")
    return { text: "This offer has a booking. Settle money matters on", href: ROUTES.bookings, link: "Bookings" }
  if (target?.kind === "REQUEST" && !CLOSABLE_STAGES.includes(target.stage) && target.stage !== "CLOSED")
    return { text: "This request has a booking. Settle money matters on", href: ROUTES.bookings, link: "Bookings" }
  return null
}
