import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { accountHttp } from "@/lib/http/client"
import { isApiError } from "@/lib/http/errors"
import type { PaymentKind } from "@/lib/bookings"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { AccountNotification, Booking, PaymentInit } from "@/types/account/dashboard"

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
  startPayment: ({ bookingId, kind }: { bookingId: number, kind: PaymentKind }) =>
    accountHttp.post<PaymentInit>(`/api/book/${bookingId}/pay-${kind}/`),
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

export const startPaymentMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.startPayment,
    mutationFn: accountDashboardService.startPayment,
  })
