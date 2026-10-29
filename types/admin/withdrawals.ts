import type { WithdrawalStatus } from "@/types/account/wallet"

export type { WithdrawalStatus }

/** `?status=` on `GET /api/admin/withdrawals`; "unsuccessful" = failed or rejected */
export type WithdrawalFilter = "pending" | "processing" | "paid" | "unsuccessful"

export type WithdrawalCounts = Record<WithdrawalFilter, number>

/** From `GET /api/admin/withdrawals` (staff only); amounts in naira as decimal strings */
export interface WithdrawalForReview {
  id: number
  artisan: { id: string, name: string, email: string, wallet_balance: string }
  amount: string
  status: WithdrawalStatus
  bank_name: string
  account_number: string
  /** As the bank has it (checked with Paystack) */
  account_name: string
  /** Why it was rejected or failed */
  note: string
  reference: string
  transfer_code: string
  reviewed_by: string | null
  reviewed_at: string | null
  completed_at: string | null
  created_at: string
}
