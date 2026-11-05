"use client"

import { useState } from "react"
import { CircleAlert } from "lucide-react"
import FormField from "@/components/form/form-field"
import SubmitButton from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDeleteAccount } from "@/hooks/account/use-profile"

const CONFIRM_WORD = "DELETE"

/** Asks the person to type a word first, since they can't undo this themselves */
const DeleteSection = () => {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState("")
  const { mutate, isPending, error, reset } = useDeleteAccount()

  const changeOpen = (next: boolean) => {
    setOpen(next)
    if (!next) {
      setTyped("")
      reset()
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="max-w-md text-sm text-hw-grey-700">
        You&apos;ll be signed out and won&apos;t be able to sign in again. Finish any open bookings first, and withdraw any money in your wallet.
      </p>
      <Button variant="destructive" onClick={() => changeOpen(true)}>Delete account</Button>

      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              if (typed === CONFIRM_WORD) mutate()
            }}
          >
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>
                You won&apos;t be able to sign in again, and you can&apos;t sign up with this email or phone number. To undo this you&apos;d need to contact support.
              </DialogDescription>
            </DialogHeader>
            <FormField
              name="confirm-delete"
              label={`Type ${CONFIRM_WORD} to confirm`}
              autoComplete="off"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              disabled={isPending}
            />
            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-lg bg-[#FFF0EF] px-3 py-2.5 text-sm text-[#C2271D]">
                <CircleAlert className="mt-0.5 size-4 shrink-0" />
                {error.message}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => changeOpen(false)} disabled={isPending}>Keep my account</Button>
              <SubmitButton variant="destructive" size="default" pending={isPending} pendingText="Deleting…" disabled={typed !== CONFIRM_WORD}>
                Delete account
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DeleteSection
