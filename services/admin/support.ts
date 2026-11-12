import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { TicketStatus } from "@/types/account/support"
import type { StaffReply, SupportCounts, SupportFilter, TicketForStaff } from "@/types/admin/support"

// Staff-only; router routes have no trailing slash
export const adminSupportService = {
  list: (status: SupportFilter, signal?: AbortSignal) => http.get<TicketForStaff[]>("/api/admin/support", { params: { status }, signal }),
  counts: (signal?: AbortSignal) => http.get<SupportCounts>("/api/admin/support/counts", { signal }),
  /** Opening it marks the user's messages as read by staff */
  ticket: (id: number, signal?: AbortSignal) => http.get<TicketForStaff>(`/api/admin/support/${id}`, { signal }),
  reply: ({ id, text, then }: StaffReply) => http.post<TicketForStaff>(`/api/admin/support/${id}/reply`, { text, then }),
  assign: ({ id, staff }: { id: number, staff: string | null }) => http.post<TicketForStaff>(`/api/admin/support/${id}/assign`, { staff }),
  update: ({ id, ...changes }: { id: number, status?: TicketStatus, priority?: TicketForStaff["priority"] }) =>
    http.post<TicketForStaff>(`/api/admin/support/${id}/update`, changes),
}

export const adminSupportQuery = (status: SupportFilter) =>
  queryOptions({
    queryKey: queryKeys.admin.supportTickets(status),
    queryFn: ({ signal }) => adminSupportService.list(status, signal),
    refetchInterval: 60_000,
  })

export const adminSupportCountsQuery = () =>
  queryOptions({ queryKey: queryKeys.admin.supportCounts(), queryFn: ({ signal }) => adminSupportService.counts(signal), refetchInterval: 60_000 })

export const adminSupportTicketQuery = (id: number) =>
  queryOptions({ queryKey: queryKeys.admin.supportTicket(id), queryFn: ({ signal }) => adminSupportService.ticket(id, signal), refetchInterval: 30_000 })

export const replySupportMutation = () => mutationOptions({ mutationKey: mutationKeys.admin.replySupport, mutationFn: adminSupportService.reply })
export const assignSupportMutation = () => mutationOptions({ mutationKey: mutationKeys.admin.assignSupport, mutationFn: adminSupportService.assign })
export const updateSupportMutation = () => mutationOptions({ mutationKey: mutationKeys.admin.updateSupport, mutationFn: adminSupportService.update })
