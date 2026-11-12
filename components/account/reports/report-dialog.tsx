"use client"

import { useState } from "react"
import { Flag } from "lucide-react"
import { cn } from "cn"
import SubmitButton from "@/components/form/submit-button"
import TextareaField from "@/components/form/textarea-field"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCreateReport } from "@/hooks/account/use-reports"
import { MAX_REPORT_DETAILS, MIN_OTHER_DETAILS, REPORT_REASONS, TARGET_NOUNS } from "@/lib/reports"
import type { ReportReason, ReportTarget } from "@/types/account/reports"

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: ReportTarget
  /** e.g. "Ada's offer", shown in the title; defaults to "this offer" */
  subject?: string
}

const ReportForm = ({ target, subject, onDone }: Omit<ReportDialogProps, "open" | "onOpenChange"> & { onDone: () => void }) => {
  const [reason, setReason] = useState<ReportReason | "">("")
  const [details, setDetails] = useState("")
  const [touched, setTouched] = useState(false)
  const { mutate, isPending } = useCreateReport()
  const noun = TARGET_NOUNS[target.type]
  const reasonError = reason ? undefined : "Choose what's wrong."
  const detailsError =
    reason === "OTHER" && details.trim().length < MIN_OTHER_DETAILS ? `Tell us what happened (at least ${MIN_OTHER_DETAILS} characters).` : undefined

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (!reason || detailsError) return
    mutate({ target, reason, details: details.trim() }, { onSuccess: onDone })
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle>Report {subject ?? `this ${noun}`}</DialogTitle>
        <DialogDescription>
          Our team reviews every report. The person won&apos;t see who reported them. If you&apos;re in danger, contact the police first.
        </DialogDescription>
      </DialogHeader>

      <FieldSet data-invalid={touched && !!reasonError}>
        <FieldLegend variant="label">What&apos;s wrong?</FieldLegend>
        <RadioGroup
          name="report-reason"
          value={reason}
          onValueChange={(next) => setReason(next as ReportReason)}
          disabled={isPending}
          aria-invalid={touched && !!reasonError}
          className="gap-1.5"
        >
          {REPORT_REASONS.map(({ value, label, description }) => (
            <FieldLabel key={value} htmlFor={`report-reason-${value}`} className="w-full">
              <Field orientation="horizontal" className="py-2.5!">
                <FieldContent>
                  <FieldTitle>{label}</FieldTitle>
                  <FieldDescription className="text-xs">{description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem value={value} id={`report-reason-${value}`} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        {touched && reasonError && <p className="text-sm text-destructive">{reasonError}</p>}
      </FieldSet>

      <TextareaField
        name="report-details"
        label={reason === "OTHER" ? "What happened?" : "Anything else we should know? (optional)"}
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        error={detailsError}
        touched={touched}
        maxLength={MAX_REPORT_DETAILS}
        placeholder="Dates, what was said, or anything that helps us look into it."
        disabled={isPending}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
        <SubmitButton pending={isPending} pendingText="Sending…" size="default" variant="destructive">
          Send report
        </SubmitButton>
      </DialogFooter>
    </form>
  )
}

/** Tell our team about an account, request, offer, message, booking or review */
export const ReportDialog = ({ open, onOpenChange, ...props }: ReportDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
      {/* Mounted only while open, so it starts fresh each time */}
      {open && <ReportForm {...props} onDone={() => onOpenChange(false)} />}
    </DialogContent>
  </Dialog>
)

interface ReportButtonProps extends Pick<ReportDialogProps, "target" | "subject"> {
  /** Defaults to "Report" */
  label?: string
  variant?: "ghost" | "outline" | "link"
  size?: "sm" | "xs" | "default"
  className?: string
}

/** A quiet "Report" button with its own dialog */
const ReportButton = ({ target, subject, label = "Report", variant = "ghost", size = "sm", className }: ReportButtonProps) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn("text-hw-grey-500 hover:text-destructive", className)}
        onClick={() => setOpen(true)}
      >
        <Flag data-icon="inline-start" />
        {label}
      </Button>
      <ReportDialog open={open} onOpenChange={setOpen} target={target} subject={subject} />
    </>
  )
}

export default ReportButton
