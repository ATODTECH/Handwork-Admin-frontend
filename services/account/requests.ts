import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { accountHttp } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type {
  AcceptOfferPayload,
  CustomerOffer,
  JobRequest,
  RequestAttachment,
  RequestMessage,
  RequestPayload,
  RequestThread,
} from "@/types/account/requests"

// Videos can be up to 50MB, so uploads get much longer than the default timeout
const UPLOAD_TIMEOUT_MS = 10 * 60_000

export interface AttachmentUpload {
  requestId: number
  file: File
  private?: boolean
  /** 0–100 as the file goes up */
  onProgress?: (percent: number) => void
}

// Router routes have no trailing slash (see `setup/urls.py` on the API)
export const requestsService = {
  list: (signal?: AbortSignal) => accountHttp.get<JobRequest[]>("/api/requests", { signal }),
  get: (id: number, signal?: AbortSignal) => accountHttp.get<JobRequest>(`/api/requests/${id}`, { signal }),

  /** Saves a draft; publishing is a separate step, after the photos and videos are uploaded */
  create: (payload: RequestPayload) => accountHttp.post<JobRequest>("/api/requests", payload),
  update: ({ id, payload }: { id: number, payload: Partial<RequestPayload> }) =>
    accountHttp.patch<JobRequest>(`/api/requests/${id}`, payload),
  remove: (id: number) => accountHttp.delete<void>(`/api/requests/${id}`),

  /** Publishes a draft, or renews an expired request */
  publish: (id: number) => accountHttp.post<JobRequest>(`/api/requests/${id}/publish`),
  close: ({ id, reason }: { id: number, reason?: string }) =>
    accountHttp.post<JobRequest>(`/api/requests/${id}/close`, { reason: reason ?? "" }),

  /** One file per call, so each can show its own progress */
  uploadAttachment: ({ requestId, file, private: isPrivate = false, onProgress }: AttachmentUpload) => {
    const body = new FormData()
    body.append("file", file)
    body.append("private", String(isPrivate))
    return accountHttp.post<RequestAttachment>(`/api/requests/${requestId}/attachments`, body, {
      timeout: UPLOAD_TIMEOUT_MS,
      onUploadProgress: (event) => {
        if (event.total) onProgress?.(Math.round((event.loaded / event.total) * 100))
      },
    })
  },
  removeAttachment: ({ requestId, attachmentId }: { requestId: number, attachmentId: number }) =>
    accountHttp.delete<void>(`/api/requests/${requestId}/attachments/${attachmentId}`),

  /** Every offer except withdrawn ones; opening them marks them viewed for the provider */
  offers: (requestId: number, signal?: AbortSignal) =>
    accountHttp.get<CustomerOffer[]>(`/api/requests/${requestId}/offers`, { signal }),
  /** Creates the booking at "Accepted" with the offer's price; the customer then pays it as usual */
  acceptOffer: ({ offerId, date, time, address }: AcceptOfferPayload) =>
    accountHttp.post<{ offer: CustomerOffer, booking_id: number }>(`/api/offers/${offerId}/accept`, {
      scheduled_date: date,
      scheduled_time: time,
      address,
    }),
  rejectOffer: ({ offerId, reason }: { offerId: number, reason?: string }) =>
    accountHttp.post<CustomerOffer>(`/api/offers/${offerId}/reject`, { reason: reason ?? "" }),

  // The customer's chat with one provider about the request
  thread: ({ requestId, providerId }: { requestId: number, providerId: string }, signal?: AbortSignal) =>
    accountHttp.get<RequestThread>(`/api/requests/${requestId}/messages`, { params: { provider: providerId }, signal }),
  sendMessage: ({ requestId, providerId, text }: { requestId: number, providerId: string, text: string }) =>
    accountHttp.post<RequestMessage>(`/api/requests/${requestId}/messages`, { provider: providerId, text }),
  markThreadRead: ({ requestId, providerId }: { requestId: number, providerId: string }) =>
    accountHttp.post<{ updated: number }>(`/api/requests/${requestId}/messages/read`, { provider: providerId }),
}

export const myRequestsQuery = () =>
  queryOptions({
    queryKey: queryKeys.account.requests(),
    queryFn: ({ signal }) => requestsService.list(signal),
  })

export const requestQuery = (id: number) =>
  queryOptions({
    queryKey: queryKeys.account.request(id),
    queryFn: ({ signal }) => requestsService.get(id, signal),
  })

export const publishRequestMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.account.publishRequest, mutationFn: requestsService.publish })

export const closeRequestMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.account.closeRequest, mutationFn: requestsService.close })

export const deleteRequestMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.account.deleteRequest, mutationFn: requestsService.remove })

export const requestOffersQuery = (requestId: number) =>
  queryOptions({
    queryKey: queryKeys.account.requestOffers(requestId),
    queryFn: ({ signal }) => requestsService.offers(requestId, signal),
  })

export const requestThreadQuery = (requestId: number, providerId: string) =>
  queryOptions({
    queryKey: queryKeys.account.requestThread(requestId, providerId),
    queryFn: ({ signal }) => requestsService.thread({ requestId, providerId }, signal),
  })

export const acceptOfferMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.account.acceptOffer, mutationFn: requestsService.acceptOffer })

export const rejectOfferMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.account.rejectOffer, mutationFn: requestsService.rejectOffer })

export const sendRequestMessageMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.account.sendRequestMessage, mutationFn: requestsService.sendMessage })
