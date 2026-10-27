"use client"

import { useState } from "react"
import TextareaField from "@/components/form/textarea-field"
import SubmitButton from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRejectArtisan } from "@/hooks/admin/use-artisan-review"

// One click fills the reason; the reviewer can still edit it
const QUICK_REASONS = [
  "The ID photo is unclear or cut off.",
  "The name on the ID doesn't match the account name.",
  "The NIN doesn't match the uploaded ID.",
  "The work photos don't show the services offered.",
]

const MIN_REASON = 10
const MAX_REASON = 500

interface RejectDialogProps {
  artisan: { id: string, name: string } | null
  onOpenChange: (open: boolean) => void
  onRejected: () => void
}

/** Ask for changes: the reason is sent to the artisan, so it must say what to fix */
const RejectDialog = ({ artisan, onOpenChange, onRejected }: RejectDialogProps) => {
  const [reason, setReason] = useState("")
  const [touched, setTouched] = useState(false)
  const { mutate, isPending } = useRejectArtisan()
  const error = reason.trim().length < MIN_REASON ? "Tell the artisan what to fix (at least 10 characters)." : undefined

  const close = (open: boolean) => {
    if (open) return
    setReason("")
    setTouched(false)
    onOpenChange(false)
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (error || !artisan) return
    mutate({ id: artisan.id, reason: reason.trim() }, {
      onSuccess: () => {
        close(false)
        onRejected()
      },
    })
  }

  return (
    <Dialog open={artisan !== null} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Request changes from {artisan?.name}</DialogTitle>
            <DialogDescription>
              They won&apos;t appear to customers until approved. We&apos;ll send them this reason by email and in the app.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            {QUICK_REASONS.map((quick) => (
              <Button key={quick} type="button" variant="outline" size="sm" className="h-auto py-1.5 text-left whitespace-normal" onClick={() => setReason(quick)}>
                {quick}
              </Button>
            ))}
          </div>

          <TextareaField
            name="reject-reason"
            label="Reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            onBlur={() => setTouched(true)}
            error={error}
            touched={touched}
            maxLength={MAX_REASON}
            placeholder="e.g. The ID photo is blurry. Please upload a clearer photo of your driver's licence."
            disabled={isPending}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => close(false)} disabled={isPending}>
              Cancel
            </Button>
            <SubmitButton pending={isPending} pendingText="Sending…" size="default" variant="destructive">
              Request changes
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RejectDialog
