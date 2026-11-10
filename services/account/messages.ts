import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { env } from "@/lib/env"
import { accountHttp } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { ChatMessage, Conversation } from "@/types/account/messages"

// The chat router keeps Django's trailing slashes (`chat/urls.py` on the API); `/api/conversations` doesn't
export const messagesService = {
  /** Booking chats, and chats about requests before an offer is accepted */
  conversations: (signal?: AbortSignal) => accountHttp.get<Conversation[]>("/api/conversations", { signal }),
  messages: (bookingId: number, signal?: AbortSignal) => accountHttp.get<ChatMessage[]>(`/api/chat/${bookingId}/`, { signal }),
  /** Also pushed to everyone on the booking's WebSocket */
  send: ({ bookingId, text }: { bookingId: number, text: string }) =>
    accountHttp.post<ChatMessage>(`/api/chat/${bookingId}/send/`, { text }),
  /** Marks the other person's messages as read */
  markRead: (bookingId: number) => accountHttp.post<{ updated: number }>(`/api/chat/${bookingId}/read/`),
}

/** The booking's live chat; the API reads the JWT from `?token=` */
export const chatSocketUrl = (bookingId: number, token: string) =>
  `${env.apiBaseUrl.replace(/^http/, "ws")}/ws/chat/${bookingId}/?token=${encodeURIComponent(token)}`

export const conversationsQuery = () =>
  queryOptions({
    queryKey: queryKeys.account.conversations(),
    queryFn: ({ signal }) => messagesService.conversations(signal),
  })

export const chatMessagesQuery = (bookingId: number) =>
  queryOptions({
    queryKey: queryKeys.account.messages(bookingId),
    queryFn: ({ signal }) => messagesService.messages(bookingId, signal),
  })

export const sendMessageMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.sendMessage,
    mutationFn: messagesService.send,
  })

export const markMessagesReadMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.markMessagesRead,
    mutationFn: messagesService.markRead,
  })
