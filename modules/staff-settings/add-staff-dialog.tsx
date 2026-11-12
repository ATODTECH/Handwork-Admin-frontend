"use client"

import { useState } from "react"
import { Check, CircleAlert, Copy, ShieldCheck, UserRound } from "lucide-react"
import ChoiceCardGroup from "@/components/form/choice-card-group"
import FormField from "@/components/form/form-field"
import SubmitButton from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateStaff } from "@/hooks/admin/use-staff"
import { toApiError } from "@/lib/http/errors"
import { toInternationalContact } from "@/schema/validation-account"
import type { CreatedStaff, NewStaff, StaffRole } from "@/types/admin/staff"
import { ROLE_INFO } from "./staff-role"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?\d{7,14}$/
const EMPTY: NewStaff = { first_name: "", last_name: "", email: "", contact: "", role: "SUPPORT" }

const ROLE_OPTIONS = (["SUPPORT", "ADMIN"] as StaffRole[]).map((role) => ({
  value: role,
  label: ROLE_INFO[role].label,
  description: ROLE_INFO[role].description,
  icon: role === "ADMIN" ? ShieldCheck : UserRound,
}))

/** Shown once after adding someone: the email may not arrive, so the admin can pass it on themselves */
const Created = ({ staff, onDone }: { staff: CreatedStaff, onDone: () => void }) => {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(staff.temporary_password)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>{staff.first_name} has been added</DialogTitle>
        <DialogDescription>
          We&apos;ve emailed {staff.email} a link to sign in with this temporary password. You won&apos;t see it again, so share it
          yourself if the email doesn&apos;t arrive. They should change it in Settings.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-hw-border bg-muted px-4 py-3">
        <code className="text-sm font-semibold break-all text-hw-grey-900">{staff.temporary_password}</code>
        <Button type="button" variant="outline" size="sm" onClick={copy}>
          {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <DialogFooter>
        <Button onClick={onDone}>Done</Button>
      </DialogFooter>
    </>
  )
}

const AddForm = ({ onCreated, onCancel }: { onCreated: (staff: CreatedStaff) => void, onCancel: () => void }) => {
  const create = useCreateStaff()
  const [values, setValues] = useState<NewStaff>(EMPTY)
  const [touched, setTouched] = useState(false)
  const apiError = create.error ? toApiError(create.error) : null
  const fieldError = (field: keyof NewStaff) => apiError?.fieldErrors[field]?.[0]
  const errors: Partial<Record<keyof NewStaff, string>> = {
    first_name: values.first_name.trim() ? fieldError("first_name") : "Enter their first name.",
    email: EMAIL.test(values.email.trim()) ? fieldError("email") : "Enter a valid email.",
    contact: PHONE.test(values.contact.trim()) ? fieldError("contact") : "Enter a valid phone number, e.g. 08012345678",
  }
  const known = ["first_name", "last_name", "email", "contact", "role"]
  const formError = apiError && !known.some((field) => apiError.fieldErrors[field]) ? apiError.message : null
  const set = (field: keyof NewStaff) => (event: React.ChangeEvent<HTMLInputElement>) => setValues({ ...values, [field]: event.target.value })

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (!values.first_name.trim() || !EMAIL.test(values.email.trim()) || !PHONE.test(values.contact.trim())) return
    create.mutate(
      { ...values, first_name: values.first_name.trim(), last_name: values.last_name.trim(), email: values.email.trim(), contact: toInternationalContact(values.contact.trim()) },
      { onSuccess: onCreated },
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle>Add a staff member</DialogTitle>
        <DialogDescription>They get an email with a temporary password to sign in to the admin console.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField name="new-first-name" label="First name" value={values.first_name} onChange={set("first_name")} error={errors.first_name} touched={touched || !!apiError} />
        <FormField name="new-last-name" label="Last name" value={values.last_name} onChange={set("last_name")} />
        <FormField name="new-email" label="Work email" type="email" value={values.email} onChange={set("email")} error={errors.email} touched={touched || !!apiError} />
        <FormField name="new-phone" label="Phone" type="tel" value={values.contact} onChange={set("contact")} error={errors.contact} touched={touched || !!apiError} />
      </div>
      <ChoiceCardGroup name="new-role" legend="Role" options={ROLE_OPTIONS} value={values.role} onValueChange={(role) => setValues({ ...values, role })} disabled={create.isPending} />
      {formError && (
        <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
          <CircleAlert className="size-4" />
          {formError}
        </p>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={create.isPending}>
          Cancel
        </Button>
        <SubmitButton pending={create.isPending} pendingText="Adding…" size="default">
          Add staff member
        </SubmitButton>
      </DialogFooter>
    </form>
  )
}

const AddStaffDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [created, setCreated] = useState<CreatedStaff | null>(null)
  const close = (next: boolean) => {
    if (next) return
    setCreated(null)
    onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        {open && (created ? <Created staff={created} onDone={() => close(false)} /> : <AddForm onCreated={setCreated} onCancel={() => close(false)} />)}
      </DialogContent>
    </Dialog>
  )
}

export default AddStaffDialog
