import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/query/keys"
import {
  adminSupportCountsQuery,
  adminSupportQuery,
  adminSupportTicketQuery,
  assignSupportMutation,
  replySupportMutation,
  updateSupportMutation,
} from "@/services/admin/support"
import type { SupportFilter, TicketForStaff } from "@/types/admin/support"

export const useAdminSupport = (status: SupportFilter) => useQuery(adminSupportQuery(status))

export const useAdminSupportCounts = () => useQuery(adminSupportCountsQuery())

export const useAdminSupportTicket = (id: number | null) => useQuery({ ...adminSupportTicketQuery(id ?? 0), enabled: id !== null })

/** Any change moves tickets between tabs and changes counts and the notifications badge */
const useSupportChanged = () => {
  const queryClient = useQueryClient()
  return (ticket: TicketForStaff) => {
    queryClient.setQueryData(queryKeys.admin.supportTicket(ticket.id), ticket)
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.supportRoot(), predicate: (query) => query.queryKey[2] !== "ticket" }),
      queryClient.invalidateQueries({ queryKey: [...queryKeys.admin.all, "notifications"] }),
    ])
  }
}

export const useReplySupport = () => {
  const changed = useSupportChanged()
  return useMutation({
    ...replySupportMutation(),
    onSuccess: async (ticket) => {
      await changed(ticket)
      toast.success(ticket.status === "RESOLVED" ? "Replied and resolved. We've emailed them." : "Reply sent. We've emailed them.")
    },
  })
}

export const useAssignSupport = () => {
  const changed = useSupportChanged()
  return useMutation({ ...assignSupportMutation(), onSuccess: changed })
}

export const useUpdateSupport = () => {
  const changed = useSupportChanged()
  return useMutation({ ...updateSupportMutation(), onSuccess: changed })
}
