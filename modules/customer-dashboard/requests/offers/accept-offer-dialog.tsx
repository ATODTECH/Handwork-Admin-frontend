"use client"

import { useFormik } from "formik"
import * as Yup from "yup"
import { CircleAlert, ShieldCheck } from "lucide-react"
import DateField from "@/components/form/date-field"
import FormField from "@/components/form/form-field"
import { fieldState, textFieldProps, touch } from "@/components/form/formik-field-props"
import SubmitButton from "@/components/form/submit-button"
import TimeField from "@/components/form/time-field"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FieldGroup } from "@/components/ui/field"
import { useAcceptOffer } from "@/hooks/account/use-requests"
import { formLevelError, toFormErrors } from "@/lib/form-errors"
import { formatNairaAmount } from "@/lib/format"
import { toApiError } from "@/lib/http/errors"
import { completionLabel, includedLabel, NOT_STATED } from "@/lib/offers"
import { todayIso } from "@/schema/validation-booking"
import type { CustomerOffer, JobRequest } from "@/types/account/requests"

interface AgreementValues {
  date: string
  time: string
  address: string
}

const API_FIELDS: Record<string, keyof AgreementValues> = {
  scheduled_date: "date",
  scheduled_time: "time",
  address: "address",
}

const agreementSchema = (needsAddress: boolean) =>
  Yup.object({
    date: Yup.string()
      .required("Choose a date")
      .test("not-past", "Choose today or a later date", (value) => !value || value >= todayIso()),
    time: Yup.string().required("Choose a time"),
    address: needsAddress
      ? Yup.string().trim().required("Enter the address").min(5, "Enter the full address").max(400, "Keep it under 400 characters")
      : Yup.string().trim().max(400, "Keep it under 400 characters"),
  })

const Line = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-hw-grey-500">{label}</span>
    <span className="text-right text-hw-grey-900">{value}</span>
  </div>
)

interface AcceptOfferDialogProps {
  request: JobRequest
  offer: CustomerOffer | null
  onOpenChange: (open: boolean) => void
}

/** The final agreement: the terms one last time, then when and where. Accepting creates the booking to pay for. */
const AcceptOfferDialog = ({ request, offer, onOpenChange }: AcceptOfferDialogProps) => {
  const accept = useAcceptOffer()
  const needsAddress = request.fulfilment !== "REMOTE"

  const formik = useFormik<AgreementValues>({
    // A fresh form for each offer
    enableReinitialize: true,
    initialValues: { date: request.deadline && request.deadline >= todayIso() ? request.deadline : "", time: "", address: request.address },
    validationSchema: agreementSchema(needsAddress),
    onSubmit: async ({ date, time, address }, { setErrors }) => {
      if (!offer) return
      try {
        await accept.mutateAsync({ offerId: offer.id, date, time, address: address.trim() })
      } catch (error) {
        setErrors(toFormErrors(toApiError(error), API_FIELDS))
      }
    },
  })

  const formError = formLevelError(accept.error, API_FIELDS)

  return (
    <Dialog
      open={offer !== null}
      onOpenChange={(open) => {
        if (!open) {
          formik.resetForm()
          accept.reset()
        }
        onOpenChange(open)
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {offer && (
          <form noValidate onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>Accept {offer.provider.name}&apos;s offer?</DialogTitle>
              <DialogDescription>Check the terms, then choose when the job happens. The other offers will be turned down.</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2 rounded-xl border border-hw-border p-4">
              <Line label="Price" value={formatNairaAmount(offer.price)} />
              <Line label="Ready in" value={completionLabel(offer.completion_days)} />
              <Line label="Materials" value={includedLabel(offer.materials_included)} />
              <Line label="Labour" value={includedLabel(offer.labour_included)} />
              <Line label="Warranty" value={offer.warranty || NOT_STATED} />
              <Line label="Extra charges" value={offer.additional_charges || "None stated"} />
            </div>

            {offer.is_estimate && (
              <p className="flex items-start gap-2 rounded-lg bg-[#FFF8EB] px-3 py-2.5 text-sm text-hw-grey-700">
                <CircleAlert className="mt-0.5 size-4 shrink-0 text-hw-text-warning" />
                This is an estimate. If the price changes once they&apos;ve seen the job, agree it in Messages before paying.
              </p>
            )}

            <FieldGroup className="gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <DateField
                  {...fieldState(formik, "date")}
                  label="Date"
                  disablePast
                  value={formik.values.date}
                  onValueChange={(date) => formik.setFieldValue("date", date)}
                  onTouch={touch(formik, "date")}
                />
                <TimeField
                  {...fieldState(formik, "time")}
                  label="Time"
                  value={formik.values.time}
                  onValueChange={(time) => formik.setFieldValue("time", time)}
                  onTouch={touch(formik, "time")}
                />
              </div>
              {needsAddress && (
                <FormField
                  {...textFieldProps(formik, "address")}
                  label={request.fulfilment === "DELIVERY" ? "Delivery address" : "Address for the job"}
                  placeholder="House number, street and area"
                  autoComplete="street-address"
                  description={`${offer.provider.name.split(" ")[0]} will see it once you accept.`}
                />
              )}
            </FieldGroup>

            <p className="flex items-start gap-2 text-xs text-hw-grey-500">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-hw-secondary" />
              Next you pay {formatNairaAmount(offer.price)} to confirm. We hold it and only pay the provider once you confirm the
              job is done.
            </p>

            {formError && (
              <p role="alert" className="flex items-start gap-2 rounded-lg bg-[#FFF0EF] px-3 py-2.5 text-sm text-[#C2271D]">
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                {formError}
              </p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Not yet
              </Button>
              <SubmitButton pending={formik.isSubmitting} pendingText="Accepting…" size="default">
                Accept offer
              </SubmitButton>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AcceptOfferDialog
