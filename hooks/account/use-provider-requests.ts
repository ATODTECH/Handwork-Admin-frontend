import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRequestChatSocket } from "@/hooks/account/use-request-chat-socket"
import { accountSession } from "@/lib/auth/session"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import {
  myOffersQuery,
  providerRequestQuery,
  providerRequestsService,
  providerThreadQuery,
  requestFeedQuery,
} from "@/services/account/requests"
import type { RequestFeedFilters, RequestThread } from "@/types/account/requests"
import { markAllRead } from "@/lib/requests"

// Request chats have no WebSocket in the web yet, so an open chat refreshes on a timer
const THREAD_REFRESH_MS = 10_000

/** Open requests the provider can send offers on. The last results stay up while new filters load. */
export const useRequestFeed = (filters: RequestFeedFilters) =>
  useQuery({ ...requestFeedQuery(filters), placeholderData: (previous) => previous })

export const useProviderRequest = (id: number) => useQuery(providerRequestQuery(id))

export const useMyOffers = () => useQuery(myOffersQuery())

/** After any change to an offer, the feed, the request and My offers all show it */
const useRefreshProviderData = () => {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.account.providerRequests() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.account.myOffers() }),
    ])
}

export const useSaveRequest = () => {
  const refresh = useRefreshProviderData()
  return useMutation({
    mutationKey: mutationKeys.account.bookmarkRequest,
    mutationFn: providerRequestsService.save,
    onSuccess: ({ saved }) => {
      void refresh()
      toast.success(saved ? "Saved for later." : "Removed from saved.")
    },
  })
}

export const useSendOffer = () => {
  const refresh = useRefreshProviderData()
  return useMutation({
    mutationKey: mutationKeys.account.sendOffer,
    mutationFn: providerRequestsService.send,
    meta: { silentError: true },
    onSuccess: async () => {
      await refresh()
      toast.success("Offer sent. We'll let you know when the customer replies.")
    },
  })
}

export const useReviseOffer = () => {
  const refresh = useRefreshProviderData()
  return useMutation({
    mutationKey: mutationKeys.account.reviseOffer,
    mutationFn: providerRequestsService.revise,
    meta: { silentError: true },
    onSuccess: async () => {
      await refresh()
      toast.success("Offer updated. The customer can see what changed.")
    },
  })
}

export const useWithdrawOffer = () => {
  const refresh = useRefreshProviderData()
  return useMutation({
    mutationKey: mutationKeys.account.withdrawOffer,
    mutationFn: providerRequestsService.withdraw,
    onSuccess: async () => {
      await refresh()
      toast.success("Offer withdrawn.")
    },
  })
}

/** The artisan's chat with the customer about a request: live over the WebSocket, refreshed only while that's down */
export const useProviderThread = (requestId: number, open: boolean) => {
  // The conversation is keyed by the artisan, who is the signed-in user here
  const myId = typeof document === "undefined" ? "" : accountSession.getUserId() ?? ""
  const live = useRequestChatSocket(requestId, myId, queryKeys.account.providerThread(requestId), open)
  return useQuery({ ...providerThreadQuery(requestId), enabled: open, refetchInterval: open && !live ? THREAD_REFRESH_MS : false })
}

export const useSendProviderMessage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: providerRequestsService.sendMessage,
    meta: { silentError: true },
    onSuccess: (_, { requestId }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.providerThread(requestId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.conversations() })
    },
  })
}

/** Marks the customer's messages read, here and in the unread counts */
export const useMarkProviderThreadRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: providerRequestsService.markThreadRead,
    meta: { silentError: true },
    onSuccess: (_, requestId) => {
      queryClient.setQueryData<RequestThread>(queryKeys.account.providerThread(requestId), markAllRead)
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.conversations() })
    },
  })
}
