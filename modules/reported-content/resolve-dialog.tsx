"use client"

import { useState } from "react"
import Link from "next/link"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import ChoiceCardGroup, { type ChoiceOption } from "@/components/form/choice-card-group"
import SubmitButton from "@/components/form/submit-button"
import TextareaField from "@/components/form/textarea-field"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useResolveReport } from "@/hooks/admin/use-reports"
import { TARGET_NOUNS } from "@/lib/reports"
import type { ReportForStaff, ResolveReport } from "@/types/admin/reports"
import { targetSummary } from "./columns"
import { elsewhere, removalLabel } from "./moderation"

const MIN_NOTE = 5
const MAX_NOTE = 2000

const OPTIONS: ChoiceOption<ResolveReport["outcome"]>[] = [
  {
    value: "action",
    label: "Something was wrong",
    description: "We tell the reporter we took action.",
    icon: ShieldAlert,
  },
  {
    value: "dismiss",
    label: "Nothing against our rules",
    description: "We tell the reporter we looked and found nothing wrong.",
    icon: ShieldCheck,
  },
]

const ResolveForm = ({ report, onDone }: { report: ReportForStaff, onDone: () => void }) => {
  const [outcome, setOutcome] = useState<ResolveReport["outcome"]>("action")
  const [hide, setHide] = useState(false)
  const [note, setNote] = useState("")
  const [touched, setTouched] = useState(false)
  const { mutate, isPending } = useResolveReport()
  const removal = removalLabel(report)
  const otherPlace = elsewhere(report)
  const removing = outcome === "action" && hide && !!removal
  const error = note.trim().length < MIN_NOTE ? `Add a note (at least ${MIN_NOTE} characters).` : undefined

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (error) return
    mutate({ id: report.id, outcome, note: note.trim(), hide: removing }, { onSuccess: onDone })
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle>Settle this report</DialogTitle>
        <DialogDescription>
          {report.other_open_reports > 0
            ? `This also settles ${report.other_open_reports} other open ${report.other_open_reports === 1 ? "report" : "reports"} about the same ${TARGET_NOUNS[report.target_type]}.`
            : "This can't be undone."}
        </DialogDescription>
      </DialogHeader>

      <p className="rounded-xl bg-secondary px-4 py-3 text-sm leading-relaxed text-hw-grey-700">
        <span className="font-medium text-hw-grey-900">{report.reason_label}:</span> {targetSummary(report)}
      </p>

      <ChoiceCardGroup name="report-outcome" legend="Decision" options={OPTIONS} value={outcome} onValueChange={setOutcome} disabled={isPending} />

      {outcome === "action" && removal && (
        <div className="flex items-start gap-3 rounded-xl border border-hw-border p-3">
          <Checkbox id="report-hide" checked={hide} disabled={isPending} onCheckedChange={(value) => setHide(value === true)} />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="report-hide" className="text-sm font-medium text-hw-grey-900">{removal}</Label>
            <span className="text-xs text-hw-grey-500">
              {report.reported_user?.name ?? "The person"} is told it was removed, with your note.
            </span>
          </div>
        </div>
      )}
      {outcome === "action" && otherPlace && (
        <p className="text-xs text-hw-grey-500">
          {otherPlace.text}{" "}
          <Link href={otherPlace.href} className="font-medium text-hw-primary underline-offset-4 hover:underline">{otherPlace.link}</Link>.
        </p>
      )}

      <TextareaField
        name="report-note"
        label={removing ? "Note (sent to the person whose content is removed)" : "Note for our records"}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        onBlur={() => setTouched(true)}
        error={error}
        touched={touched}
        maxLength={MAX_NOTE}
        placeholder={removing ? "e.g. Asking customers to pay outside Handwork Expert isn't allowed." : "What you found and why you decided this."}
        disabled={isPending}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
        <SubmitButton pending={isPending} pendingText="Settling…" size="default" variant={removing ? "destructive" : "default"}>
          {outcome === "dismiss" ? "Dismiss report" : removing ? "Remove and settle" : "Settle report"}
        </SubmitButton>
      </DialogFooter>
    </form>
  )
}

interface ResolveDialogProps {
  report: ReportForStaff | null
  onOpenChange: (open: boolean) => void
}

/** Dismiss a report, or act on it (optionally removing what was reported). Reporters are told the outcome. */
const ResolveDialog = ({ report, onOpenChange }: ResolveDialogProps) => (
  <Dialog open={report !== null} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
      {report && <ResolveForm key={report.id} report={report} onDone={() => onOpenChange(false)} />}
    </DialogContent>
  </Dialog>
)

export default ResolveDialog
