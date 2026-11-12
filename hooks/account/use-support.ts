import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/query/keys"
import {
  createTicketMutation,
  replyTicketMutation,
  resolveTicketMutation,
  ticketQuery,
  ticketsQuery,
  unreadTicketsQuery,
} from "@/services/account/support"
import type { SupportTicket } from "@/types/account/support"

export const useTickets = () => useQuery(ticketsQuery())

/** One ticket with its messages; refreshed while it's open, since our team may reply */
export const useTicket = (id: number | null) => useQuery({ ...ticketQuery(id ?? 0), enabled: id !== null, refetchInterval: 30_000 })

/** Our team's replies they haven't read, for the menu badge */
export const useUnreadTickets = () => useQuery(unreadTicketsQuery()).data?.count ?? 0

/** Every change to a ticket refreshes the list, the badge and the open ticket */
const useTicketChanged = () => {
  const queryClient = useQueryClient()
  return (ticket: SupportTicket) => {
    queryClient.setQueryData(queryKeys.account.ticket(ticket.id), ticket)
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.account.tickets(), exact: true }),
      queryClient.invalidateQueries({ queryKey: queryKeys.account.ticketsUnread() }),
    ])
  }
}

export const useCreateTicket = () => {
  const changed = useTicketChanged()
  return useMutation({
    ...createTicketMutation(),
    meta: { silentError: true },
    onSuccess: async (ticket) => {
      await changed(ticket)
      toast.success(`Sent. Your reference is ${ticket.reference}; we'll reply here and by email.`)
    },
  })
}

export const useReplyTicket = () => {
  const changed = useTicketChanged()
  return useMutation({ ...replyTicketMutation(), onSuccess: changed })
}

export const useResolveTicket = () => {
  const changed = useTicketChanged()
  return useMutation({
    ...resolveTicketMutation(),
    onSuccess: async (ticket) => {
      await changed(ticket)
      toast.success("Marked as resolved. Reply any time if you need more help.")
    },
  })
}
