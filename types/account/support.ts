export type TicketCategory = "PAYMENT" | "BOOKING" | "REQUEST" | "ACCOUNT" | "VERIFICATION" | "OTHER"

/** OPEN: waiting on our team. WAITING: we replied and are waiting on them. RESOLVED: done; replying reopens it. */
export type TicketStatus = "OPEN" | "WAITING" | "RESOLVED"

export interface TicketMessage {
  id: number
  from_staff: boolean
  /** Staff show as "Ngozi from Handwork Expert" to users, and by full name to other staff */
  author_name: string
  text: string
  created_at: string
}

/** From `/api/support/tickets`: the customer's or artisan's own help requests */
export interface SupportTicket {
  id: number
  /** "HW-00012" */
  reference: string
  subject: string
  category: TicketCategory
  category_label: string
  booking: number | null
  status: TicketStatus
  /** A staff reply they haven't read */
  unread: boolean
  last_message_at: string
  resolved_at: string | null
  created_at: string
  /** Only when opening one ticket */
  messages: TicketMessage[] | null
}

export interface NewTicket {
  category: TicketCategory
  subject: string
  message: string
  booking?: number | null
}
