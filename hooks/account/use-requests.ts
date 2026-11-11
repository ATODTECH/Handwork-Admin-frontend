import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import { ACCOUNT_ROUTES, customerRequestRoute } from "@/lib/routes"
import {
  acceptOfferMutation,
  closeRequestMutation,
  deleteRequestMutation,
  myRequestsQuery,
  publishRequestMutation,
  rejectOfferMutation,
  requestOffersQuery,
  requestQuery,
  requestsService,
  requestThreadQuery,
  sendRequestMessageMutation,
} from "@/services/account/requests"
import { markAllRead } from "@/lib/requests"
import type { JobRequest, RequestAttachment, RequestPayload, RequestThread } from "@/types/account/requests"

export const useMyRequests = () => useQuery(myRequestsQuery())

export const useRequest = (id: number) => useQuery(requestQuery(id))

/** A photo or video picked in the form and not uploaded yet */
export interface PendingUpload {
  key: string
  file: File
  private: boolean
}

export interface SaveRequestInput {
  /** Set once a draft exists (editing, or retrying after an upload failed), so it's updated, not duplicated */
  requestId: number | null
  payload: RequestPayload
  uploads: PendingUpload[]
  removedAttachmentIds: number[]
  /** Publish a draft once everything is saved */
  publish: boolean
  /** Called as soon as the draft exists, so a retry updates it */
  onSaved: (request: JobRequest) => void
  onProgress: (key: string, percent: number) => void
  /** Called per finished upload, so a retry skips it */
  onUploaded: (key: string, attachment: RequestAttachment) => void
}

/**
 * Saves the request in steps: the details (creating a draft the first time), then removed and new photos
 * and videos one at a time, then publishing. If a step fails, what's done stays done and a retry carries on.
 */
export const useSaveRequest = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: mutationKeys.account.saveRequest,
    meta: { silentError: true },
    mutationFn: async ({ requestId, payload, uploads, removedAttachmentIds, publish, onSaved, onProgress, onUploaded }: SaveRequestInput) => {
      let request = requestId
        ? await requestsService.update({ id: requestId, payload })
        : await requestsService.create(payload)
      onSaved(request)

      for (const attachmentId of removedAttachmentIds) {
        await requestsService.removeAttachment({ requestId: request.id, attachmentId })
      }
      for (const upload of uploads) {
        const attachment = await requestsService.uploadAttachment({
          requestId: request.id,
          file: upload.file,
          private: upload.private,
          onProgress: (percent) => onProgress(upload.key, percent),
        })
        onUploaded(upload.key, attachment)
      }
      if (publish && request.status === "DRAFT") request = await requestsService.publish(request.id)
      return { request, published: publish && requestId === null }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.account.requests() }),
    onSuccess: ({ request, published }) => {
      toast.success(
        request.status === "DRAFT"
          ? "Draft saved."
          : published
            ? request.visibility === "PRIVATE"
              ? "Request sent. We'll let you know when they reply with an offer."
              : "Request published. We've told artisans who offer this service."
            : "Request updated.",
      )
      router.push(customerRequestRoute(request.id))
    },
  })
}

/** Publishes a draft, or renews an expired request */
export const usePublishRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...publishRequestMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.account.requests() })
      toast.success("Request published. Artisans can send offers now.")
    },
  })
}

export const useCloseRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...closeRequestMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.account.requests() })
      toast.success("Request closed.")
    },
  })
}

export const useDeleteRequest = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    ...deleteRequestMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.account.requests() })
      toast.success("Draft deleted.")
      router.push(ACCOUNT_ROUTES.customerRequests)
    },
  })
}

// A request chat has no WebSocket in the web yet, so it refreshes while open
const THREAD_REFRESH_MS = 10_000

/** The offers on one of the customer's requests (only while it's had any chance of getting some) */
export const useRequestOffers = (requestId: number, enabled = true) =>
  useQuery({ ...requestOffersQuery(requestId), enabled })

/** Accepts an offer, then opens My bookings so the customer can pay for it */
export const useAcceptOffer = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    ...acceptOfferMutation(),
    meta: { silentError: true },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.account.requests() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.account.bookings() }),
      ])
      toast.success("Offer accepted. Pay for it to confirm the booking.")
      router.push(ACCOUNT_ROUTES.customerBookings)
    },
  })
}

export const useRejectOffer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...rejectOfferMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.account.requests() })
      toast.success("Offer turned down. We've let the artisan know.")
    },
  })
}

/** The customer's chat with one provider about a request, refreshed while it's open */
export const useRequestThread = (requestId: number, providerId: string, open: boolean) =>
  useQuery({ ...requestThreadQuery(requestId, providerId), enabled: open, refetchInterval: open ? THREAD_REFRESH_MS : false })

export const useSendRequestMessage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...sendRequestMessageMutation(),
    meta: { silentError: true },
    onSuccess: (_, { requestId, providerId }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.requestThread(requestId, providerId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.conversations() })
    },
  })
}

/** Marks the provider's messages read, here and in the unread counts */
export const useMarkRequestThreadRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: requestsService.markThreadRead,
    meta: { silentError: true },
    onSuccess: (_, { requestId, providerId }) => {
      queryClient.setQueryData<RequestThread>(queryKeys.account.requestThread(requestId, providerId), markAllRead)
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.conversations() })
    },
  })
}
