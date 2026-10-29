import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { formatNairaAmount } from "@/lib/format"
import { queryKeys } from "@/lib/query/keys"
import { adminBookingCountsQuery, adminBookingsQuery, resolveBookingMutation } from "@/services/admin/bookings"
import type { BookingFilter } from "@/types/admin/bookings"

export const useAdminBookings = (status: BookingFilter) => useQuery(adminBookingsQuery(status))

export const useAdminBookingCounts = () => useQuery(adminBookingCountsQuery())

/** Settling a problem moves the booking between tabs and changes the dashboard's figures, so refetch both */
export const useResolveBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...resolveBookingMutation(),
    onSuccess: async ({ status, agreed_amount, client, artisan }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.bookingsRoot() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview() }),
      ])
      toast.success(
        status === "Refunded"
          ? `${formatNairaAmount(agreed_amount ?? 0)} is being refunded to ${client.name}.`
          : `${artisan?.name ?? "The artisan"} has been paid.`,
      )
    },
  })
}
