import type { BookingStatus } from "./dashboard"
import type { RequestStage } from "./requests"

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

interface ConversationBase {
  services: string[]
  /** A booking's date, or a request's deadline */
  scheduled_date: string | null
  created_at: string
  /** The other person: the artisan for a customer, the customer for an artisan (first name only before a booking) */
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
  /** False once the booking is closed, or the request stops taking offers: the chat is then read-only */
  can_send: boolean
}

/** A booking's chat */
export interface BookingConversation extends ConversationBase {
  kind: "booking"
  booking_id: number
  /** The request it came from, when it came from an accepted offer */
  request_id: number | null
  status: BookingStatus
}

/** A customer and one provider talking about a request before an offer is accepted */
export interface RequestConversation extends ConversationBase {
  kind: "request"
  booking_id: null
  request_id: number
  request_title: string
  provider_id: string
  status: RequestStage
}

/** From `GET /api/conversations`, most recent activity first */
export type Conversation = BookingConversation | RequestConversation

/** What the booking's WebSocket sends */
export type ChatSocketEvent =
  | { messages: ChatMessage[] }
  | { type: "chat.message", message: ChatMessage }
  | { error: string }
