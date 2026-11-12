"use client"

import { useState } from "react"
import { cn } from "cn"
import { BadgeCheck, MessageSquareReply, Pencil } from "lucide-react"
import ReportButton from "@/components/account/reports/report-dialog"
import SubmitButton from "@/components/form/submit-button"
import TextareaField from "@/components/form/textarea-field"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useReplyToReview } from "@/hooks/account/use-reviews"
import { formatActivityDate, initials } from "@/lib/format"
import { MAX_REPLY } from "@/lib/reviews"
import type { Review } from "@/types/account/reviews"
import { Stars } from "./stars"

const MIN_REPLY = 2

/** The provider writes or changes their public answer */
const ReplyForm = ({ review, onDone }: { review: Review, onDone: () => void }) => {
  const [reply, setReply] = useState(review.reply)
  const [touched, setTouched] = useState(false)
  const { mutate, isPending } = useReplyToReview()
  const error = reply.trim().length < MIN_REPLY ? "Write a reply first." : undefined

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (error) return
    mutate({ id: review.id, reply: reply.trim() }, { onSuccess: onDone })
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <TextareaField
        name={`reply-${review.id}`}
        label="Your reply"
        description="Everyone who reads this review sees your reply. Once you reply, the customer can't change their review."
        value={reply}
        onChange={(event) => setReply(event.target.value)}
        onBlur={() => setTouched(true)}
        error={error}
        touched={touched}
        maxLength={MAX_REPLY}
        placeholder={`Thank ${review.client.split(" ")[0]}, or explain your side politely.`}
        disabled={isPending}
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
        <SubmitButton pending={isPending} pendingText="Posting…" size="sm">
          {review.reply ? "Save reply" : "Post reply"}
        </SubmitButton>
      </div>
    </form>
  )
}

interface ReviewCardProps {
  review: Review
  /** The reviewed provider may reply */
  canReply?: boolean
  /** e.g. Edit for the customer who wrote it */
  actions?: React.ReactNode
  /** Leave out the reviewer's name and avatar (when it's the viewer's own review) */
  compact?: boolean
  /** Offer "Report" (the provider reporting a review of them) */
  reportable?: boolean
  className?: string
}

/** One review with its stars, words, job and the provider's reply */
const ReviewCard = ({ review, canReply = false, actions, compact = false, reportable = false, className }: ReviewCardProps) => {
  const [replying, setReplying] = useState(false)

  return (
    <article className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-start gap-3">
        {!compact && (
          <Avatar className="size-9">
            <AvatarFallback className="bg-secondary text-xs font-semibold text-hw-secondary">{initials(review.client)}</AvatarFallback>
          </Avatar>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {!compact && <span className="text-sm font-semibold text-hw-grey-900">{review.client}</span>}
            <Stars value={review.star} />
            <span className="text-xs text-hw-grey-500">{formatActivityDate(review.created_at)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {review.verified ? (
              <span className="inline-flex items-center gap-1 text-xs text-hw-text-green-solid">
                <BadgeCheck className="size-3.5" />
                Paid job on Handwork Expert
              </span>
            ) : (
              <span className="text-xs text-hw-grey-500">Older rating, not tied to a job</span>
            )}
            {review.services.map((service) => (
              <Badge key={service} variant="secondary" className="text-[11px]">{service}</Badge>
            ))}
          </div>
        </div>
        {actions}
        {reportable && <ReportButton target={{ type: "REVIEW", id: review.id }} subject={`${review.client}'s review`} size="xs" />}
      </div>

      {review.message ? (
        <p className="text-sm leading-relaxed whitespace-pre-line text-hw-grey-700">{review.message}</p>
      ) : (
        <p className="text-sm text-hw-grey-500 italic">No written review.</p>
      )}

      {replying ? (
        <ReplyForm review={review} onDone={() => setReplying(false)} />
      ) : review.reply ? (
        <div className="flex flex-col gap-1 rounded-xl bg-muted p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-hw-grey-900">
              Reply from {review.artisan.split(" ")[0]}
              {review.replied_at && <span className="font-normal text-hw-grey-500"> · {formatActivityDate(review.replied_at)}</span>}
            </span>
            {canReply && (
              <Button variant="ghost" size="sm" className="h-7" onClick={() => setReplying(true)}>
                <Pencil data-icon="inline-start" />
                Edit
              </Button>
            )}
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-line text-hw-grey-700">{review.reply}</p>
        </div>
      ) : (
        canReply && (
          <Button variant="outline" size="sm" className="w-fit" onClick={() => setReplying(true)}>
            <MessageSquareReply data-icon="inline-start" />
            Reply
          </Button>
        )
      )}
    </article>
  )
}

export default ReviewCard
