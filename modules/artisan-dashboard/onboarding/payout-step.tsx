"use client"

import { useFormik } from "formik"
import { HandCoins, ShieldCheck } from "lucide-react"
import ChoiceCardGroup, { type ChoiceOption } from "@/components/form/choice-card-group"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import { useBanks, useSaveBankDetails } from "@/hooks/account/use-artisan-onboarding"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import { payoutSchema, type PayoutFormValues } from "@/schema/validation-artisan"
import type { PayoutMethod } from "@/types/account/artisan"
import RetryHint from "./retry-hint"
import StepForm from "./step-form"

const PAYOUT_METHODS: ChoiceOption<PayoutMethod>[] = [
  {
    value: "escrow_payment",
    label: "Escrow payment",
    description: "The customer pays upfront; we hold it safely and transfer it to you once the job is done.",
    icon: ShieldCheck,
  },
  {
    value: "payment_on_delivery",
    label: "Payment on delivery",
    description: "The customer pays you directly when you finish the job.",
    icon: HandCoins,
  },
]

const API_FIELDS: Record<string, keyof PayoutFormValues> = {
  name: "bankName",
  account_number: "accountNumber",
  account_name: "accountName",
}

/** Step 3: where earnings are paid. Saving it completes onboarding */
const PayoutStep = () => {
  const { mutateAsync, error, isPending } = useSaveBankDetails()
  const banks = useBanks()
  const bankOptions = (banks.data ?? []).map(({ name }) => ({ value: name, label: name }))

  const formik = useFormik<PayoutFormValues>({
    initialValues: { bankName: "", accountNumber: "", accountName: "", payoutMethod: "escrow_payment" },
    validationSchema: payoutSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await mutateAsync(payoutSchema.cast(values))
      } catch (saveError) {
        setErrors(toFormErrors(toApiError(saveError), API_FIELDS))
      }
    },
  })

  return (
    <StepForm
      onSubmit={formik.handleSubmit}
      pending={isPending}
      submitLabel="Finish setup"
      pendingLabel="Finishing up…"
      formError={formLevelError(error, API_FIELDS)}
    >
      <ComboboxField
        {...fieldState(formik, "bankName")}
        label="Bank"
        placeholder={banks.isPending ? "Loading banks…" : "Search for your bank"}
        description={banks.isError && <RetryHint message="We couldn't load the list of banks." onRetry={banks.refetch} />}
        disabled={formik.isSubmitting || banks.isPending || banks.isError}
        options={bankOptions}
        value={formik.values.bankName || null}
        onValueChange={(name) => formik.setFieldValue("bankName", name ?? "")}
        onTouch={touch(formik, "bankName")}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          {...textFieldProps(formik, "accountNumber", { digits: true })}
          label="Account number"
          placeholder="10-digit NUBAN"
          maxLength={10}
        />
        <FormField
          {...textFieldProps(formik, "accountName")}
          label="Account name"
          placeholder="As it appears on your bank account"
          autoComplete="name"
        />
      </div>

      <ChoiceCardGroup
        {...fieldState(formik, "payoutMethod")}
        legend="How do you want to receive payment?"
        options={PAYOUT_METHODS}
        value={formik.values.payoutMethod}
        onValueChange={(value) => formik.setFieldValue("payoutMethod", value)}
        columns={2}
      />
    </StepForm>
  )
}

export default PayoutStep
