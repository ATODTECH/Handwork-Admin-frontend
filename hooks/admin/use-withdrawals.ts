import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { formatNairaAmount } from "@/lib/format"
import { queryKeys } from "@/lib/query/keys"
import {
  approveWithdrawalMutation,
  rejectWithdrawalMutation,
  withdrawalCountsQuery,
  withdrawalsQuery,
} from "@/services/admin/withdrawals"
import type { WithdrawalFilter } from "@/types/admin/withdrawals"

export const useWithdrawals = (status: WithdrawalFilter) => useQuery(withdrawalsQuery(status))

export const useWithdrawalCounts = () => useQuery(withdrawalCountsQuery())

/** A decision moves the withdrawal between tabs, so refetch every list and the counts */
const useRefreshWithdrawals = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.withdrawalsRoot() })
}

export const useApproveWithdrawal = () => {
  const refresh = useRefreshWithdrawals()
  return useMutation({
    ...approveWithdrawalMutation(),
    onSuccess: async ({ amount, artisan, status, note }) => {
      await refresh()
      // Paystack can refuse a transfer (e.g. not enough balance); the API then refunds the artisan
      if (status === "FAILED") toast.error(`Paystack couldn't send it, so it was refunded to ${artisan.name}. ${note}`)
      else toast.success(`${formatNairaAmount(amount)} is on its way to ${artisan.name}.`)
    },
  })
}

export const useRejectWithdrawal = () => {
  const refresh = useRefreshWithdrawals()
  return useMutation({
    ...rejectWithdrawalMutation(),
    onSuccess: async ({ amount, artisan }) => {
      await refresh()
      toast.success(`${formatNairaAmount(amount)} was returned to ${artisan.name}'s balance.`)
    },
  })
}
