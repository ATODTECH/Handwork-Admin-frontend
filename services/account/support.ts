import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { accountHttp } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { NewTicket, SupportTicket } from "@/types/account/support"

// Router routes have no trailing slash
export const supportService = {
  list: (signal?: AbortSignal) => accountHttp.get<SupportTicket[]>("/api/support/tickets", { signal }),
  /** Opening it marks our team's replies as read */
  ticket: (id: number, signal?: AbortSignal) => accountHttp.get<SupportTicket>(`/api/support/tickets/${id}`, { signal }),
  unread: (signal?: AbortSignal) => accountHttp.get<{ count: number }>("/api/support/tickets/unread", { signal }),
  create: (body: NewTicket) => accountHttp.post<SupportTicket>("/api/support/tickets", body),
  /** Replying to a resolved ticket opens it again */
  reply: ({ id, text }: { id: number, text: string }) => accountHttp.post<SupportTicket>(`/api/support/tickets/${id}/messages`, { text }),
  resolve: (id: number) => accountHttp.post<SupportTicket>(`/api/support/tickets/${id}/resolve`),
}

export const ticketsQuery = () =>
  queryOptions({ queryKey: queryKeys.account.tickets(), queryFn: ({ signal }) => supportService.list(signal) })

export const ticketQuery = (id: number) =>
  queryOptions({ queryKey: queryKeys.account.ticket(id), queryFn: ({ signal }) => supportService.ticket(id, signal) })

export const unreadTicketsQuery = () =>
  queryOptions({ queryKey: queryKeys.account.ticketsUnread(), queryFn: ({ signal }) => supportService.unread(signal), refetchInterval: 60_000 })

export const createTicketMutation = () => mutationOptions({ mutationKey: mutationKeys.account.createTicket, mutationFn: supportService.create })
export const replyTicketMutation = () => mutationOptions({ mutationKey: mutationKeys.account.replyTicket, mutationFn: supportService.reply })
export const resolveTicketMutation = () => mutationOptions({ mutationKey: mutationKeys.account.resolveTicket, mutationFn: supportService.resolve })
