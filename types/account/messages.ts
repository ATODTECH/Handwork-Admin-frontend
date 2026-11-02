import type { BookingStatus } from "./dashboard"

/** One message in a booking's chat (`GET /api/chat/{booking}/`, and the WebSocket) */
export interface ChatMessage {
  /** A number over REST, a string over the WebSocket: compare with `String()` */
  id: number | string
  /** The sender's user id */
  sender: string
  sender_name: string
  sender_role: string
  text: string
  timestamp: string
  is_read: boolean
}

/** A booking as a conversation, from `GET /api/conversations` */
export interface Conversation {
  booking_id: number
  status: BookingStatus
  services: string[]
  scheduled_date: string | null
  created_at: string
  /** The other person: the artisan for a customer, the customer for an artisan */
  with: {
    id: string
    name: string
    profile_image: string | null
  }
  last_message: {
    text: string
    timestamp: string
    mine: boolean
  } | null
  /** Messages from the other person not read yet */
  unread: number
  /** False once the booking is closed: the chat is then read-only */
  can_send: boolean
}

/** What the booking's WebSocket sends */
export type ChatSocketEvent =
  | { messages: ChatMessage[] }
  | { type: "chat.message", message: ChatMessage }
  | { error: string }
