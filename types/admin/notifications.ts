export type StaffNotificationKind =
  | "ARTISAN_REVIEW"
  | "PROBLEM_REPORTED"
  | "PROBLEM_SETTLED"
  | "WITHDRAWAL_REQUESTED"
  | "PAYOUT_FAILED"
  | "REPORT"

/** The admin page each notification opens */
export type StaffNotificationPage = "artisans" | "bookings" | "payouts" | "reported-content"

export interface StaffNotification {
  /** Stable, e.g. "report-12", so read state can be remembered */
  id: string
  kind: StaffNotificationKind
  at: string
  title: string
  detail: string
  /** Still waiting on staff (approve, settle, pay out, review a report) */
  needs_action: boolean
  link: { page: StaffNotificationPage, id: string | number | null }
}

/** From `GET /api/admin/notifications?days=30` (staff only): waiting items first, then newest */
export interface StaffNotifications {
  days: number
  needs_action: number
  needs_action_by_kind: Partial<Record<StaffNotificationKind, number>>
  items: StaffNotification[]
}
