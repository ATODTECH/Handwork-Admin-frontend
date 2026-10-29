import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { formatNairaAmount } from "@/lib/format"
import { queryKeys } from "@/lib/query/keys"
import { requestWithdrawalMutation, updateBankDetailsMutation, walletQuery } from "@/services/account/wallet"

export const useWallet = () => useQuery(walletQuery())

const useRefreshWallet = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.account.wallet() })
}

export const useRequestWithdrawal = () => {
  const refresh = useRefreshWallet()

  return useMutation({
    ...requestWithdrawalMutation(),
    meta: { silentError: true },
    onSuccess: async ({ amount }) => {
      await refresh()
      toast.success(`Withdrawal of ${formatNairaAmount(amount)} requested. We'll let you know when it's sent.`)
    },
  })
}

export const useUpdateBankDetails = () => {
  const refresh = useRefreshWallet()

  return useMutation({
    ...updateBankDetailsMutation(),
    meta: { silentError: true },
    onSuccess: async () => {
      await refresh()
      toast.success("Bank account updated")
    },
  })
}
