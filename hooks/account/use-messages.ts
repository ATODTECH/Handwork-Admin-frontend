import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query"
import { accountSession } from "@/lib/auth/session"
import { queryKeys } from "@/lib/query/keys"
import {
  chatMessagesQuery,
  chatSocketUrl,
  conversationsQuery,
  markMessagesReadMutation,
  sendMessageMutation,
} from "@/services/account/messages"
import type { ChatMessage, ChatSocketEvent } from "@/types/account/messages"

const CONVERSATIONS_REFRESH_MS = 30_000
/** Only while the live connection is down */
const MESSAGES_FALLBACK_REFRESH_MS = 10_000
const MAX_RECONNECT_DELAY_MS = 30_000

/** Adds a message to a booking's cached chat, once (the sender gets it back from the socket too) */
const addMessage = (queryClient: QueryClient, bookingId: number, message: ChatMessage) =>
  queryClient.setQueryData<ChatMessage[]>(queryKeys.account.messages(bookingId), (current = []) =>
    current.some(({ id }) => String(id) === String(message.id)) ? current : [...current, message],
  )

/** Every booking as a conversation; kept fresh so unread counts update */
export const useConversations = () =>
  useQuery({ ...conversationsQuery(), refetchInterval: CONVERSATIONS_REFRESH_MS })

/** For the sidebar badge */
export const useUnreadMessages = () =>
  useQuery({
    ...conversationsQuery(),
    refetchInterval: CONVERSATIONS_REFRESH_MS,
    select: (conversations) => conversations.reduce((total, { unread }) => total + unread, 0),
    meta: { silentError: true },
  }).data ?? 0

/** A booking's messages; polled only while the live connection is down */
export const useChatMessages = (bookingId: number, live: boolean) =>
  useQuery({ ...chatMessagesQuery(bookingId), refetchInterval: live ? false : MESSAGES_FALLBACK_REFRESH_MS })

export const useSendMessage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...sendMessageMutation(),
    meta: { silentError: true },
    onSuccess: (message, { bookingId }) => {
      addMessage(queryClient, bookingId, message)
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.conversations() })
    },
  })
}

export const useMarkMessagesRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...markMessagesReadMutation(),
    meta: { silentError: true },
    onSuccess: (_, bookingId) => {
      queryClient.setQueryData<ChatMessage[]>(queryKeys.account.messages(bookingId), (current) =>
        current?.map((message) => ({ ...message, is_read: true })),
      )
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.conversations() })
    },
  })
}

/**
 * Live updates for one booking's chat over the API's WebSocket. Returns whether it's connected;
 * while it isn't, `useChatMessages` polls instead. Reconnects with a growing delay.
 */
export const useChatSocket = (bookingId: number, enabled: boolean) => {
  const queryClient = useQueryClient()
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let socket: WebSocket | null = null
    let retry: ReturnType<typeof setTimeout> | undefined
    let attempts = 0
    let stopped = false

    const connect = () => {
      const token = accountSession.getAccessToken()
      if (!token) return
      socket = new WebSocket(chatSocketUrl(bookingId, token))

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data) as ChatSocketEvent
        if ("messages" in data) {
          attempts = 0
          queryClient.setQueryData(queryKeys.account.messages(bookingId), data.messages)
          setLive(true)
        } else if ("message" in data) {
          addMessage(queryClient, bookingId, data.message)
          void queryClient.invalidateQueries({ queryKey: queryKeys.account.conversations() })
        }
      }

      socket.onclose = (event) => {
        setLive(false)
        if (stopped) return
        // 4002 / 4004: not this user's booking, or no such booking; retrying won't help
        if (event.code === 4002 || event.code === 4004) return
        // 4001: the access token expired; a REST refetch refreshes it before the next try
        if (event.code === 4001) void queryClient.invalidateQueries({ queryKey: queryKeys.account.messages(bookingId) })
        retry = setTimeout(connect, Math.min(MAX_RECONNECT_DELAY_MS, 2_000 * 2 ** attempts++))
      }
    }

    connect()
    return () => {
      stopped = true
      clearTimeout(retry)
      socket?.close()
    }
  }, [bookingId, enabled, queryClient])

  return enabled && live
}
