import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { accountHttp } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { BankDetailsPayload } from "@/types/account/artisan"
import type { Wallet, Withdrawal } from "@/types/account/wallet"

// Artisan-only; router routes have no trailing slash
export const walletService = {
  wallet: (signal?: AbortSignal) => accountHttp.get<Wallet>("/api/wallet", { signal }),
  /** Holds the amount from the balance until staff approve it */
  requestWithdrawal: (amount: number) => accountHttp.post<Withdrawal>("/api/withdrawals", { amount: amount.toFixed(2) }),
  /** The API checks the new account with Paystack before saving it */
  updateBankDetails: ({ id, bankName, bankCode, accountNumber }: BankDetailsPayload) =>
    accountHttp.put(`/api/bank_details/${id}`, { name: bankName, bank_code: bankCode, account_number: accountNumber }),
}

export const walletQuery = () =>
  queryOptions({
    queryKey: queryKeys.account.wallet(),
    queryFn: ({ signal }) => walletService.wallet(signal),
  })

export const requestWithdrawalMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.requestWithdrawal,
    mutationFn: walletService.requestWithdrawal,
  })

export const updateBankDetailsMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.updateBankDetails,
    mutationFn: walletService.updateBankDetails,
  })
