/** A withdrawal's progress (`Withdrawal.status` on the API) */
export type WithdrawalStatus = "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REJECTED"

/** One line of the artisan's earnings history: money in from a job, or out to their bank */
export interface WalletActivity {
  kind: "earning" | "withdrawal"
  id: string
  /** Naira, as a decimal string */
  amount: string
  description: string
  status: WithdrawalStatus
  /** Why a withdrawal was rejected or failed */
  note?: string
  date: string
}

/** The artisan's payout account; `verified` once Paystack has checked it */
export interface WalletBank {
  id: number
  name: string
  account_number: string
  account_name: string
  verified: boolean
}

/** From `GET /api/wallet` (artisans only); amounts in naira as decimal strings */
export interface Wallet {
  /** Can be withdrawn now */
  available: string
  /** Paid by customers and held until they confirm the jobs are done */
  on_the_way: string
  total_earned: string
  has_open_withdrawal: boolean
  min_withdrawal: string
  bank: WalletBank | null
  activity: WalletActivity[]
}

/** From `POST /api/withdrawals` */
export interface Withdrawal {
  id: number
  amount: string
  status: WithdrawalStatus
  bank_name: string
  account_number: string
  account_name: string
  note: string
  created_at: string
  completed_at: string | null
}
