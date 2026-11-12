import type { TicketCategory, TicketMessage, TicketStatus } from "@/types/account/support"

/** `?status=` on `GET /api/admin/support`; "mine" is open tickets assigned to the signed-in staff member */
export type SupportFilter = "open" | "waiting" | "resolved" | "mine"

export interface SupportCounts extends Record<SupportFilter | "all", number> {
  /** Not resolved, with a message staff haven't read */
  unread: number
}

export interface SupportPerson {
  id: string
  name: string
  email: string
  role: string
}

/** From `GET /api/admin/support` (staff only) */
export interface TicketForStaff {
  id: number
  reference: string
  subject: string
  category: TicketCategory
  category_label: string
  source: "APP" | "CONTACT_FORM"
  status: TicketStatus
  priority: "NORMAL" | "HIGH"
  contact: {
    /** Missing for website visitors who don't have an account */
    user: SupportPerson | null
    name: string
    email: string
    phone: string
  }
  booking: number | null
  assigned_to: SupportPerson | null
  /** A message staff haven't read */
  unread: boolean
  preview: { text: string, from_staff: boolean } | null
  last_message_at: string
  resolved_at: string | null
  created_at: string
  /** Only when opening one ticket */
  messages: TicketMessage[] | null
}

export interface StaffReply {
  id: number
  text: string
  /** After replying: wait for them (the usual), or resolve it */
  then: "WAITING" | "RESOLVED"
}
