import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { isPaystackCheckout, openPaystackPopup } from "@/lib/paystack"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import {
  accountDashboardService,
  confirmBookingMutation,
  markNotificationReadMutation,
  myBookingsQuery,
  notificationsQuery,
  updateJobMutation,
} from "@/services/account/dashboard"
import type { AccountNotification, JobUpdate } from "@/types/account/dashboard"

export const useMyBookings = () => useQuery(myBookingsQuery())

export const useNotifications = () => {
  const query = useQuery(notificationsQuery())
  const unread = query.data?.filter(({ is_read }) => !is_read).length ?? 0
  return { ...query, unread }
}

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    ...markNotificationReadMutation(),
    meta: { silentError: true },
    // Optimistic: the dot disappears immediately
    onMutate: (id) => {
      queryClient.setQueryData<AccountNotification[]>(queryKeys.account.notifications(), (list) =>
        list?.map((item) => (item.id === id ? { ...item, is_read: true } : item)),
      )
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.account.notifications() }),
  })
}

const JOB_UPDATED: Record<JobUpdate["status"], string> = {
  Accepted: "Accepted. We'll let you know when the deposit is paid.",
  Declined: "Request declined",
  "In Progress": "Job started",
  Completed: "Marked as done. We'll pay you once the customer confirms.",
}

/** An artisan accepting, declining, starting or completing a job */
export const useUpdateJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    ...updateJobMutation(),
    onSuccess: async (_, { status }) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.account.bookings() })
      toast.success(JOB_UPDATED[status])
    },
  })
}

/**
 * Pays for an accepted booking: the API starts a Paystack transaction, the customer pays in Paystack's
 * pop-up, then the API confirms it with Paystack. If the pop-up can't load, Paystack's own page opens instead.
 */
export const usePayBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.account.payBooking,
    mutationFn: async (bookingId: number) => {
      const { access_code, authorization_url } = await accountDashboardService.startPayment(bookingId)
      let result
      try {
        result = await openPaystackPopup(access_code)
      } catch {
        if (!isPaystackCheckout(authorization_url)) throw new Error("We couldn't open the payment page. Please try again.")
        window.location.assign(authorization_url)
        return "redirected" as const
      }
      if (result.status === "cancelled") return "cancelled" as const
      await accountDashboardService.verifyPayment(bookingId, result.reference)
      return "paid" as const
    },
    onSuccess: async (outcome) => {
      if (outcome === "redirected") return
      // Paystack's webhook may still confirm a payment the pop-up didn't report, so refresh either way
      await queryClient.invalidateQueries({ queryKey: queryKeys.account.all })
      if (outcome === "paid") toast.success("Payment received. We'll hold it until you confirm the job is done.")
    },
  })
}

/** The customer confirms the artisan finished the job; we then pay the artisan */
export const useConfirmBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    ...confirmBookingMutation(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.account.all })
      toast.success("Thanks for confirming. We've paid your artisan.")
    },
  })
}
