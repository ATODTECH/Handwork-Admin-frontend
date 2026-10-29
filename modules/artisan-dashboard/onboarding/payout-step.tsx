"use client"

import { useFormik } from "formik"
import { ShieldCheck } from "lucide-react"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import StepForm from "@/components/form/step-form"
import { useBanks, useSaveBankDetails } from "@/hooks/account/use-artisan-onboarding"
import { useUpdateBankDetails } from "@/hooks/account/use-wallet"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import { payoutSchema, type PayoutFormValues } from "@/schema/validation-artisan"
import RetryHint from "./retry-hint"

const API_FIELDS: Record<string, keyof PayoutFormValues> = {
  name: "bankCode",
  bank_code: "bankCode",
  account_number: "accountNumber",
}

interface BankAccountFormProps {
  /** The saved bank details to change; without it, the form adds them (onboarding's last step) */
  bankId?: number
  submitLabel?: string
  pendingLabel?: string
  onSaved?: () => void
}

/**
 * Where an artisan's earnings are paid. The API checks the account with Paystack and takes the
 * holder's name from the bank, so only the bank and account number are asked for.
 */
export const BankAccountForm = ({ bankId, submitLabel = "Finish setup", pendingLabel = "Checking your account…", onSaved }: BankAccountFormProps) => {
  const add = useSaveBankDetails()
  const change = useUpdateBankDetails()
  const { mutateAsync, error, isPending } = bankId ? change : add
  const banks = useBanks()
  const bankOptions = (banks.data ?? []).map(({ name, code }) => ({ value: code, label: name }))

  const formik = useFormik<PayoutFormValues>({
    initialValues: { bankCode: "", accountNumber: "" },
    validationSchema: payoutSchema,
    onSubmit: async (values, { setErrors }) => {
      const { bankCode, accountNumber } = payoutSchema.cast(values)
      const bankName = banks.data?.find(({ code }) => code === bankCode)?.name ?? ""
      try {
        await mutateAsync({ id: bankId, bankName, bankCode, accountNumber })
        onSaved?.()
      } catch (saveError) {
        setErrors(toFormErrors(toApiError(saveError), API_FIELDS))
      }
    },
  })

  return (
    <StepForm
      onSubmit={formik.handleSubmit}
      pending={isPending}
      submitLabel={submitLabel}
      pendingLabel={pendingLabel}
      formError={formLevelError(error, API_FIELDS)}
    >
      <ComboboxField
        {...fieldState(formik, "bankCode")}
        label="Bank"
        placeholder={banks.isPending ? "Loading banks…" : "Search for your bank"}
        description={banks.isError && <RetryHint message="We couldn't load the list of banks." onRetry={banks.refetch} />}
        disabled={formik.isSubmitting || banks.isPending || banks.isError}
        options={bankOptions}
        value={formik.values.bankCode || null}
        onValueChange={(code) => formik.setFieldValue("bankCode", code ?? "")}
        onTouch={touch(formik, "bankCode")}
      />

      <FormField
        {...textFieldProps(formik, "accountNumber", { digits: true })}
        label="Account number"
        placeholder="10-digit NUBAN"
        maxLength={10}
        description="We'll confirm the account name with your bank. Use an account in your own name."
      />

      <p className="flex gap-3 rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-hw-grey-700">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-hw-secondary" />
        <span>
          Customers pay Handwork Expert, not you directly. Once a customer confirms a job is done, we add your share
          (the price minus our 10% fee) to your earnings, and you can withdraw it to this account.
        </span>
      </p>
    </StepForm>
  )
}

/** Step 4: where earnings are paid. Saving it completes onboarding */
const PayoutStep = () => <BankAccountForm />

export default PayoutStep
