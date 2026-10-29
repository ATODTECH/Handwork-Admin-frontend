"use client"

import { useFormik } from "formik"
import { Landmark } from "lucide-react"
import FormField from "@/components/form/form-field"
import { textFieldProps } from "@/components/form/formik-field-props"
import SubmitButton from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRequestWithdrawal } from "@/hooks/account/use-wallet"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { formatNairaAmount } from "@/lib/format"
import { toApiError } from "@/lib/http/errors"
import { maskedAccount } from "@/lib/wallet"
import { withdrawalSchema } from "@/schema/validation-artisan"
import type { WalletBank } from "@/types/account/wallet"

interface WithdrawDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  available: number
  minimum: number
  bank: WalletBank
}

const API_FIELDS = { amount: "amount" } as const

/** Asks to move money from the wallet to the artisan's bank; staff approve it before it's sent */
const WithdrawDialog = ({ open, onOpenChange, available, minimum, bank }: WithdrawDialogProps) => {
  const { mutateAsync, error, isPending, reset } = useRequestWithdrawal()
  const schema = withdrawalSchema(available, minimum)

  const formik = useFormik<{ amount: string }>({
    initialValues: { amount: String(Math.floor(available)) },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await mutateAsync(schema.cast(values).amount)
        onOpenChange(false)
      } catch (saveError) {
        setErrors(toFormErrors(toApiError(saveError), API_FIELDS))
      }
    },
  })

  const close = (next: boolean) => {
    if (next) return onOpenChange(true)
    formik.resetForm()
    reset()
    onOpenChange(false)
  }
  const formError = formLevelError(error, API_FIELDS)

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Withdraw to your bank</DialogTitle>
            <DialogDescription>
              You have {formatNairaAmount(available)} available. Our team reviews withdrawals, usually within one working day,
              then the money is sent to your account.
            </DialogDescription>
          </DialogHeader>

          <FormField
            {...textFieldProps(formik, "amount", { digits: true })}
            label="Amount"
            startAddon={<span className="text-hw-grey-700">₦</span>}
            endAddon={
              <Button type="button" variant="link" size="sm" className="h-auto px-0" onClick={() => formik.setFieldValue("amount", String(Math.floor(available)))}>
                Withdraw all
              </Button>
            }
            disabled={isPending}
          />

          <div className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3">
            <Landmark className="size-5 shrink-0 text-hw-secondary" />
            <div className="flex min-w-0 flex-col text-sm">
              <span className="font-medium text-hw-grey-900">{bank.account_name}</span>
              <span className="text-hw-grey-500">{maskedAccount(bank.name, bank.account_number)}</span>
            </div>
          </div>

          {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => close(false)} disabled={isPending}>
              Cancel
            </Button>
            <SubmitButton pending={isPending} pendingText="Requesting…" size="default">
              Request withdrawal
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default WithdrawDialog
