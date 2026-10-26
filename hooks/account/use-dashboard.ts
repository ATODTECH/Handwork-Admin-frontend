import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/query/keys"
import {
  markNotificationReadMutation,
  myBookingsQuery,
  notificationsQuery,
  startPaymentMutation,
} from "@/services/account/dashboard"
import type { AccountNotification } from "@/types/account/dashboard"

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

/** Only ever leave the site for Paystack's own checkout */
const isPaystackCheckout = (url: string) => {
  try {
    const { protocol, hostname } = new URL(url)
    return protocol === "https:" && (hostname === "paystack.com" || hostname.endsWith(".paystack.com"))
  } catch {
    return false
  }
}

/** Starts a deposit/balance payment, then hands over to Paystack checkout */
export const usePayBooking = () =>
  useMutation({
    ...startPaymentMutation(),
    onSuccess: ({ authorization_url }) => {
      if (!isPaystackCheckout(authorization_url)) {
        toast.error("We couldn't open the payment page. Please try again.")
        return
      }
      window.location.assign(authorization_url)
    },
  })
