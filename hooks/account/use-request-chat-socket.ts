import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { accountSession } from "@/lib/auth/session"
import { env } from "@/lib/env"
import { queryKeys } from "@/lib/query/keys"
import type { RequestMessage, RequestThread } from "@/types/account/requests"

const MAX_RECONNECT_DELAY_MS = 30_000

/** A message as the WebSocket sends it: ids as strings, and no `hidden` flag */
interface SocketMessage extends Omit<RequestMessage, "id" | "hidden"> {
  id: string | number
}

type SocketEvent = { messages: SocketMessage[] } | { message: SocketMessage } | { error: string }

const requestSocketUrl = (requestId: number, providerId: string, token: string) =>
  `${env.apiBaseUrl.replace(/^http/, "ws")}/ws/requests/${requestId}/${providerId}/?token=${encodeURIComponent(token)}`

/**
 * The live connection for one request chat (`ws/requests/<request>/<provider>/`). New messages are added to
 * the thread already loaded over REST, so the REST refresh only runs while this is down. Returns whether it's live.
 */
export const useRequestChatSocket = (requestId: number, providerId: string, threadKey: readonly unknown[], enabled: boolean) => {
  const queryClient = useQueryClient()
  const [live, setLive] = useState(false)
  const key = JSON.stringify(threadKey)

  useEffect(() => {
    if (!enabled || !providerId) return
    const queryKey = JSON.parse(key) as unknown[]
    let socket: WebSocket | null = null
    let retry: ReturnType<typeof setTimeout> | undefined
    let attempts = 0
    let stopped = false

    const connect = () => {
      const token = accountSession.getAccessToken()
      if (!token) return
      socket = new WebSocket(requestSocketUrl(requestId, providerId, token))

      socket.onmessage = (event) => {
        let data: SocketEvent
        try {
          data = JSON.parse(event.data) as SocketEvent
        } catch {
          return
        }
        if ("messages" in data) {
          attempts = 0
          setLive(true)
        } else if ("message" in data) {
          const message: RequestMessage = { ...data.message, id: Number(data.message.id), hidden: false }
          queryClient.setQueryData<RequestThread>(queryKey, (thread) =>
            thread && !thread.messages.some(({ id }) => id === message.id)
              ? { ...thread, messages: [...thread.messages, message] }
              : thread,
          )
          void queryClient.invalidateQueries({ queryKey: queryKeys.account.conversations() })
        }
      }

      socket.onclose = (event) => {
        setLive(false)
        if (stopped) return
        // 4002 / 4004: not this person's conversation, or no such request; retrying won't help
        if (event.code === 4002 || event.code === 4004) return
        // 4001: the access token expired; a REST refetch refreshes it before the next try
        if (event.code === 4001) void queryClient.invalidateQueries({ queryKey })
        retry = setTimeout(connect, Math.min(MAX_RECONNECT_DELAY_MS, 2_000 * 2 ** attempts++))
      }
    }

    connect()
    return () => {
      stopped = true
      clearTimeout(retry)
      socket?.close()
    }
  }, [requestId, providerId, key, enabled, queryClient])

  return enabled && live
}
