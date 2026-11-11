import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/query/keys"
import {
  adminRequestCountsQuery,
  adminRequestQuery,
  adminRequestsQuery,
  closeRequestMutation,
  withdrawOfferMutation,
} from "@/services/admin/requests"
import type { RequestFilter } from "@/types/admin/requests"

export const useAdminRequests = (status: RequestFilter) => useQuery(adminRequestsQuery(status))

export const useAdminRequestCounts = () => useQuery(adminRequestCountsQuery())

export const useAdminRequest = (id: number | null) => useQuery({ ...adminRequestQuery(id ?? 0), enabled: id !== null })

/** Closing or withdrawing changes tabs, counts, offer counts and possibly report targets, so refresh them all */
const useRefreshModeration = () => {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.requestsRoot() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reportsRoot() }),
    ])
}

export const useCloseRequest = () => {
  const refresh = useRefreshModeration()
  return useMutation({
    ...closeRequestMutation(),
    onSuccess: async ({ reference }) => {
      await refresh()
      toast.success(`${reference} closed. We've told the customer and any providers who offered.`)
    },
  })
}

export const useWithdrawOffer = () => {
  const refresh = useRefreshModeration()
  return useMutation({
    ...withdrawOfferMutation(),
    onSuccess: async ({ provider }) => {
      await refresh()
      toast.success(`${provider.name}'s offer withdrawn. We've told them and the customer.`)
    },
  })
}
