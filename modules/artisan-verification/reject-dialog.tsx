"use client"

import ReasonDialog from "@/components/shared/reason-dialog"
import { useRejectArtisan } from "@/hooks/admin/use-artisan-review"

const QUICK_REASONS = [
  "The ID photo is unclear or cut off.",
  "The name on the ID doesn't match the account name.",
  "The NIN doesn't match the uploaded ID.",
  "The work photos don't show the services offered.",
]

interface RejectDialogProps {
  artisan: { id: string, name: string } | null
  onOpenChange: (open: boolean) => void
  onRejected: () => void
}

/** Ask for changes: the reason is sent to the artisan, so it must say what to fix */
const RejectDialog = ({ artisan, onOpenChange, onRejected }: RejectDialogProps) => {
  const { mutate, isPending } = useRejectArtisan()

  return (
    <ReasonDialog
      open={artisan !== null}
      onOpenChange={onOpenChange}
      title={`Request changes from ${artisan?.name ?? ""}`}
      description="They won't appear to customers until approved. We'll send them this reason by email and in the app."
      quickReasons={QUICK_REASONS}
      placeholder="e.g. The ID photo is blurry. Please upload a clearer photo of your driver's licence."
      submitLabel="Request changes"
      pending={isPending}
      onSubmit={(reason, done) =>
        artisan &&
        mutate({ id: artisan.id, reason }, {
          onSuccess: () => {
            done()
            onRejected()
          },
        })
      }
    />
  )
}

export default RejectDialog
