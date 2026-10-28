"use client"

import { useFormik } from "formik"
import { ShieldCheck } from "lucide-react"
import ComboboxField from "@/components/form/combobox-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import { useBanks, useSaveBankDetails } from "@/hooks/account/use-artisan-onboarding"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { toApiError } from "@/lib/http/errors"
import { payoutSchema, type PayoutFormValues } from "@/schema/validation-artisan"
import RetryHint from "./retry-hint"
import StepForm from "@/components/form/step-form"

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
    initialValues: { bankName: "", accountNumber: "", accountName: "" },
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

      <p className="flex gap-3 rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-hw-grey-700">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-hw-secondary" />
        <span>
          Customers pay Handwork Expert, not you directly. We hold the money safely and add it to your earnings, minus
          our 10% service fee, once the job is completed and fully paid. Your payouts go to this account.
        </span>
      </p>
    </StepForm>
  )
}

export default PayoutStep
