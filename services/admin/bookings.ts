import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { BookingCounts, BookingFilter, BookingForStaff, ResolveBooking } from "@/types/admin/bookings"

// Staff-only endpoints; router routes have no trailing slash
export const adminBookingsService = {
  list: (status: BookingFilter, signal?: AbortSignal) =>
    http.get<BookingForStaff[]>("/api/admin/bookings", { params: { status }, signal }),
  counts: (signal?: AbortSignal) => http.get<BookingCounts>("/api/admin/bookings/counts", { signal }),
  /** Settles a reported problem: pays the artisan, or refunds the customer through Paystack */
  resolve: ({ id, outcome, note }: ResolveBooking) =>
    http.post<BookingForStaff>(`/api/admin/bookings/${id}/resolve`, { outcome, note }),
}

export const adminBookingsQuery = (status: BookingFilter) =>
  queryOptions({
    queryKey: queryKeys.admin.bookings(status),
    queryFn: ({ signal }) => adminBookingsService.list(status, signal),
  })

export const adminBookingCountsQuery = () =>
  queryOptions({
    queryKey: queryKeys.admin.bookingCounts(),
    queryFn: ({ signal }) => adminBookingsService.counts(signal),
  })

export const resolveBookingMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.resolveBooking,
    mutationFn: adminBookingsService.resolve,
  })
