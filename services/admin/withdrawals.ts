import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { WithdrawalCounts, WithdrawalFilter, WithdrawalForReview } from "@/types/admin/withdrawals"

// Staff-only endpoints; router routes have no trailing slash
export const adminWithdrawalsService = {
  list: (status: WithdrawalFilter, signal?: AbortSignal) =>
    http.get<WithdrawalForReview[]>("/api/admin/withdrawals", { params: { status }, signal }),
  counts: (signal?: AbortSignal) => http.get<WithdrawalCounts>("/api/admin/withdrawals/counts", { signal }),
  /** Sends the money through Paystack */
  approve: (id: number) => http.post<WithdrawalForReview>(`/api/admin/withdrawals/${id}/approve`),
  /** Puts the money back in the artisan's wallet */
  reject: ({ id, reason }: { id: number, reason: string }) =>
    http.post<WithdrawalForReview>(`/api/admin/withdrawals/${id}/reject`, { reason }),
}

export const withdrawalsQuery = (status: WithdrawalFilter) =>
  queryOptions({
    queryKey: queryKeys.admin.withdrawals(status),
    queryFn: ({ signal }) => adminWithdrawalsService.list(status, signal),
  })

export const withdrawalCountsQuery = () =>
  queryOptions({
    queryKey: queryKeys.admin.withdrawalCounts(),
    queryFn: ({ signal }) => adminWithdrawalsService.counts(signal),
  })

export const approveWithdrawalMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.approveWithdrawal,
    mutationFn: adminWithdrawalsService.approve,
  })

export const rejectWithdrawalMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.rejectWithdrawal,
    mutationFn: adminWithdrawalsService.reject,
  })
