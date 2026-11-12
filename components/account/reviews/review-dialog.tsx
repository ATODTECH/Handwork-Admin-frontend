"use client"

import { useState } from "react"
import SubmitButton from "@/components/form/submit-button"
import TextareaField from "@/components/form/textarea-field"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEditReview, useLeaveReview } from "@/hooks/account/use-reviews"
import { MAX_REVIEW, REVIEW_EDIT_DAYS } from "@/lib/reviews"
import type { Review } from "@/types/account/reviews"
import { StarInput } from "./stars"

interface ReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Who is being reviewed */
  providerName: string
  /** What the job was, shown under the title */
  jobTitle: string
  /** New review for this booking… */
  bookingId?: number
  /** …or changes to an existing one */
  review?: Review
}

/** Stars (required) and a few words (optional) about a finished job */
const ReviewForm = ({ providerName, jobTitle, bookingId, review, onDone }: Omit<ReviewDialogProps, "open" | "onOpenChange"> & { onDone: () => void }) => {
  const [star, setStar] = useState(review?.star ?? 0)
  const [message, setMessage] = useState(review?.message ?? "")
  const [touched, setTouched] = useState(false)
  const leave = useLeaveReview()
  const edit = useEditReview()
  const pending = leave.isPending || edit.isPending

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (!star) return
    const payload = { star, message: message.trim() }
    if (review) edit.mutate({ id: review.id, ...payload }, { onSuccess: onDone })
    else if (bookingId) leave.mutate({ bookingId, ...payload }, { onSuccess: onDone })
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle>{review ? "Edit your review" : `How did ${providerName} do?`}</DialogTitle>
        <DialogDescription>
          {jobTitle}. Your first name and initial show with your review
          {review ? "." : `, and you can change it for ${REVIEW_EDIT_DAYS} days or until ${providerName} replies.`}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-1.5">
        <StarInput value={star} onChange={setStar} disabled={pending} invalid={touched && !star} />
        {touched && !star && <p className="text-sm text-destructive">Choose how many stars to give.</p>}
      </div>

      <TextareaField
        name="review-message"
        label="Tell others about the job (optional)"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        maxLength={MAX_REVIEW}
        placeholder="Was it done well and on time? Would you hire them again?"
        disabled={pending}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={pending}>
          Cancel
        </Button>
        <SubmitButton pending={pending} pendingText="Saving…" size="default">
          {review ? "Save changes" : "Post review"}
        </SubmitButton>
      </DialogFooter>
    </form>
  )
}

/** Leave a review on a released booking, or edit one */
const ReviewDialog = ({ open, onOpenChange, ...props }: ReviewDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-lg">
      {/* Mounted only while open, so it starts fresh each time */}
      {open && <ReviewForm {...props} onDone={() => onOpenChange(false)} />}
    </DialogContent>
  </Dialog>
)

export default ReviewDialog
