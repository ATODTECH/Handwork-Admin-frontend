import type { SemanticTone } from "@/lib/tones"
import type { WithdrawalStatus } from "@/types/account/wallet"

/** How a withdrawal's status reads to artisans and staff */
export const WITHDRAWAL_STATUS: Record<WithdrawalStatus, { label: string, tone: SemanticTone }> = {
  PENDING: { label: "Waiting for approval", tone: "warning" },
  PROCESSING: { label: "Sending", tone: "info" },
  PAID: { label: "Sent", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
  REJECTED: { label: "Not approved", tone: "danger" },
}

/** "GTBank ••4321" */
export const maskedAccount = (bankName: string, accountNumber: string) => `${bankName} ••${accountNumber.slice(-4)}`
