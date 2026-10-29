import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { accountHttp } from "@/lib/http/client"
import { isApiError } from "@/lib/http/errors"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { AccountNotification, Booking, JobUpdate, PaymentInit } from "@/types/account/dashboard"

// Router routes have no trailing slash; the hand-written payment paths do (see `setup/urls.py` on the API)
export const accountDashboardService = {
  /** The API answers 404 instead of `[]` when there are no bookings yet */
  myBookings: (signal?: AbortSignal) =>
    accountHttp.get<Booking[]>("/api/my_bookings", { signal }).catch((error) => {
      if (isApiError(error) && error.status === 404) return []
      throw error
    }),
  notifications: (signal?: AbortSignal) => accountHttp.get<AccountNotification[]>("/api/notifications", { signal }),
  markNotificationRead: (id: number) => accountHttp.patch(`/api/notifications/${id}/mark-read`),
  /** Artisan only: accept (with the agreed price), decline, start or complete a job */
  updateJob: ({ id, status, agreedAmount }: JobUpdate) =>
    accountHttp.patch<Booking>(`/api/book/artisan/${id}`, {
      status,
      ...(agreedAmount !== undefined && { agreed_amount: String(agreedAmount) }),
    }),
  /** Starts a Paystack transaction for the full agreed price */
  startPayment: (bookingId: number) => accountHttp.post<PaymentInit>(`/api/book/${bookingId}/pay`),
  /** Confirms a payment straight away, rather than waiting for Paystack's webhook */
  verifyPayment: (bookingId: number, reference: string) =>
    accountHttp.post<Booking>(`/api/book/${bookingId}/verify-payment`, { reference }),
  /** The customer says the job is done, which pays the artisan */
  confirmBooking: (bookingId: number) => accountHttp.post<Booking>(`/api/book/${bookingId}/confirm`),
  /** The customer cancels before paying, which also turns down the artisan's price */
  cancelBooking: ({ id, reason }: { id: number, reason?: string }) =>
    accountHttp.post<Booking>(`/api/book/${id}/cancel`, { reason: reason ?? "" }),
  /** The customer reports a problem once paid; we hold the payment until staff settle it */
  reportProblem: ({ id, reason }: { id: number, reason: string }) => accountHttp.post<Booking>(`/api/book/${id}/report`, { reason }),
}

export const myBookingsQuery = () =>
  queryOptions({
    queryKey: queryKeys.account.bookings(),
    queryFn: ({ signal }) => accountDashboardService.myBookings(signal),
  })

export const notificationsQuery = () =>
  queryOptions({
    queryKey: queryKeys.account.notifications(),
    queryFn: ({ signal }) => accountDashboardService.notifications(signal),
  })

export const markNotificationReadMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.markNotificationRead,
    mutationFn: accountDashboardService.markNotificationRead,
  })

export const updateJobMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.updateJob,
    mutationFn: accountDashboardService.updateJob,
  })

export const cancelBookingMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.cancelBooking,
    mutationFn: accountDashboardService.cancelBooking,
  })

export const reportProblemMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.reportProblem,
    mutationFn: accountDashboardService.reportProblem,
  })

export const confirmBookingMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.confirmBooking,
    mutationFn: accountDashboardService.confirmBooking,
  })
