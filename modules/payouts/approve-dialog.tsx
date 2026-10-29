"use client"

import SubmitButton from "@/components/form/submit-button"
import { DetailRow } from "@/components/shared/details-part"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useApproveWithdrawal } from "@/hooks/admin/use-withdrawals"
import { formatNairaAmount } from "@/lib/format"
import type { WithdrawalForReview } from "@/types/admin/withdrawals"

interface ApproveDialogProps {
  withdrawal: WithdrawalForReview | null
  onOpenChange: (open: boolean) => void
}

/** Approving sends real money (in live mode), so staff confirm the amount and account first */
const ApproveDialog = ({ withdrawal, onOpenChange }: ApproveDialogProps) => {
  const { mutate, isPending } = useApproveWithdrawal()

  return (
    <Dialog open={withdrawal !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send {withdrawal && formatNairaAmount(withdrawal.amount)}?</DialogTitle>
          <DialogDescription>
            Paystack sends it from Handwork Expert&apos;s balance straight away. Check the account matches the artisan.
          </DialogDescription>
        </DialogHeader>
        {withdrawal && (
          <div className="flex flex-col gap-2 rounded-xl bg-secondary px-4 py-3 text-sm">
            <DetailRow label="Artisan">{withdrawal.artisan.name}</DetailRow>
            <DetailRow label="Account name">{withdrawal.account_name}</DetailRow>
            <DetailRow label="Bank">{withdrawal.bank_name}</DetailRow>
            <DetailRow label="Account number">{withdrawal.account_number}</DetailRow>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <SubmitButton
            type="button"
            size="default"
            pending={isPending}
            pendingText="Sending…"
            onClick={() => withdrawal && mutate(withdrawal.id, { onSettled: () => onOpenChange(false) })}
          >
            Approve and send
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ApproveDialog
