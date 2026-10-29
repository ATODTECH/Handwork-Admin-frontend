"use client"

import { useState } from "react"
import TextareaField from "@/components/form/textarea-field"
import SubmitButton from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const MIN_REASON = 10
const MAX_REASON = 500

interface ReasonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  /** One click fills the reason; it can still be edited */
  quickReasons: string[]
  placeholder: string
  submitLabel: string
  pending: boolean
  /** Called with the trimmed reason; call `done` once it succeeded so the dialog closes */
  onSubmit: (reason: string, done: () => void) => void
}

/** A decision that needs a written reason for the person it affects (reject, request changes, ...) */
const ReasonDialog = ({ open, onOpenChange, title, description, quickReasons, placeholder, submitLabel, pending, onSubmit }: ReasonDialogProps) => {
  const [reason, setReason] = useState("")
  const [touched, setTouched] = useState(false)
  const error = reason.trim().length < MIN_REASON ? `Give a reason (at least ${MIN_REASON} characters).` : undefined

  const close = (next: boolean) => {
    if (next) return
    setReason("")
    setTouched(false)
    onOpenChange(false)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (error) return
    onSubmit(reason.trim(), () => close(false))
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            {quickReasons.map((quick) => (
              <Button key={quick} type="button" variant="outline" size="sm" className="h-auto py-1.5 text-left whitespace-normal" onClick={() => setReason(quick)}>
                {quick}
              </Button>
            ))}
          </div>

          <TextareaField
            name="decision-reason"
            label="Reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            onBlur={() => setTouched(true)}
            error={error}
            touched={touched}
            maxLength={MAX_REASON}
            placeholder={placeholder}
            disabled={pending}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => close(false)} disabled={pending}>
              Cancel
            </Button>
            <SubmitButton pending={pending} pendingText="Sending…" size="default" variant="destructive">
              {submitLabel}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ReasonDialog
