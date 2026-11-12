"use client"

import { useRef, useState } from "react"
import { Camera, CircleAlert } from "lucide-react"
import SectionCard from "@/components/account/section-card"
import FormField from "@/components/form/form-field"
import PasswordField from "@/components/form/password-field"
import SubmitButton from "@/components/form/submit-button"
import { UseAvatar } from "@/components/shared/use-avatar"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useChangePassword, useUpdateMe } from "@/hooks/admin/use-staff"
import { toApiError } from "@/lib/http/errors"
import { toInternationalContact } from "@/schema/validation-account"
import { IMAGE_UPLOAD } from "@/schema/validation-artisan"
import type { StaffMember } from "@/types/admin/staff"
import { StaffRoleBadge } from "./staff-role"

const PHONE = /^\+?\d{7,14}$/
const MIN_PASSWORD = 8

const PhotoAndName = ({ me }: { me: StaffMember }) => {
  const update = useUpdateMe()
  const [photoError, setPhotoError] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const name = `${me.first_name} ${me.last_name}`.trim()

  const upload = (file: File) => {
    if (!(IMAGE_UPLOAD.accept as readonly string[]).includes(file.type)) return setPhotoError("Choose a JPG, PNG or WEBP image.")
    if (file.size > IMAGE_UPLOAD.maxBytes) return setPhotoError("Choose an image under 5MB.")
    setPhotoError(null)
    const body = new FormData()
    body.append("profile_image", file)
    update.mutate(body)
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <UseAvatar src={me.profile_image ?? ""} name={name || me.email} aspectRatio="size-20" />
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-semibold text-hw-grey-900">{name || me.email}</span>
          <StaffRoleBadge role={me.role} />
        </div>
        <input
          ref={input}
          type="file"
          accept={IMAGE_UPLOAD.accept.join(",")}
          className="sr-only"
          aria-label="Profile photo"
          tabIndex={-1}
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (file) upload(file)
          }}
        />
        <Button type="button" variant="outline" size="sm" className="w-fit" disabled={update.isPending} onClick={() => input.current?.click()}>
          {update.isPending ? <Spinner data-icon="inline-start" /> : <Camera data-icon="inline-start" />}
          {me.profile_image ? "Change photo" : "Add a photo"}
        </Button>
        {photoError && <p role="alert" className="text-xs text-destructive">{photoError}</p>}
      </div>
    </div>
  )
}

const DetailsForm = ({ me }: { me: StaffMember }) => {
  const update = useUpdateMe()
  const [values, setValues] = useState({ first_name: me.first_name, last_name: me.last_name, contact: me.contact })
  const [touched, setTouched] = useState(false)
  const errors = {
    first_name: values.first_name.trim() ? undefined : "Enter your first name.",
    contact: PHONE.test(values.contact.trim()) ? undefined : "Enter a valid phone number, e.g. 08012345678",
  }
  const apiErrors = update.error ? toApiError(update.error).fieldErrors : {}
  const changed = values.first_name !== me.first_name || values.last_name !== me.last_name || values.contact !== me.contact

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (errors.first_name || errors.contact || !changed) return
    update.mutate({ first_name: values.first_name.trim(), last_name: values.last_name.trim(), contact: toInternationalContact(values.contact.trim()) })
  }
  const set = (field: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => setValues({ ...values, [field]: event.target.value })

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField name="first_name" label="First name" value={values.first_name} onChange={set("first_name")} error={errors.first_name ?? apiErrors.first_name?.[0]} touched={touched || !!apiErrors.first_name} maxLength={250} />
        <FormField name="last_name" label="Last name" value={values.last_name} onChange={set("last_name")} maxLength={250} />
        <FormField name="contact" label="Phone" type="tel" value={values.contact} onChange={set("contact")} error={errors.contact ?? apiErrors.contact?.[0]} touched={touched || !!apiErrors.contact} />
        <FormField name="email" label="Email" value={me.email} disabled description="You sign in with this. Ask an admin if it needs to change." />
      </div>
      <div className="flex justify-end">
        <SubmitButton pending={update.isPending} pendingText="Saving…" size="default" disabled={!changed}>
          Save changes
        </SubmitButton>
      </div>
    </form>
  )
}

const PasswordForm = () => {
  const change = useChangePassword()
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [touched, setTouched] = useState(false)
  const apiError = change.error ? toApiError(change.error) : null
  const errors = {
    current: current ? apiError?.fieldErrors.current_password?.[0] : "Enter your current password.",
    next: next.length < MIN_PASSWORD ? `Use at least ${MIN_PASSWORD} characters.` : apiError?.fieldErrors.new_password?.[0],
    confirm: confirm !== next ? "The passwords don't match." : undefined,
  }
  const formError = apiError && !apiError.fieldErrors.current_password && !apiError.fieldErrors.new_password ? apiError.message : null

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (!current || next.length < MIN_PASSWORD || confirm !== next) return
    change.mutate(
      { current_password: current, new_password: next },
      {
        onSuccess: () => {
          setCurrent("")
          setNext("")
          setConfirm("")
          setTouched(false)
        },
      },
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <PasswordField name="current_password" label="Current password" autoComplete="current-password" value={current} onChange={(event) => setCurrent(event.target.value)} error={errors.current} touched={touched || !!apiError} />
        <PasswordField name="new_password" label="New password" autoComplete="new-password" value={next} onChange={(event) => setNext(event.target.value)} error={errors.next} touched={touched || !!apiError} />
        <PasswordField name="confirm_password" label="Repeat new password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} error={errors.confirm} touched={touched} />
      </div>
      {formError && (
        <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
          <CircleAlert className="size-4" />
          {formError}
        </p>
      )}
      <div className="flex justify-end">
        <SubmitButton pending={change.isPending} pendingText="Changing…" size="default">
          Change password
        </SubmitButton>
      </div>
    </form>
  )
}

/** The signed-in staff member's own details and password */
const ProfilePanel = ({ me }: { me: StaffMember }) => (
  <div className="flex flex-col gap-6">
    <SectionCard title="Your details" description="Your name shows to other staff, for example on settled problems and reports.">
      <div className="flex flex-col gap-6">
        <PhotoAndName me={me} />
        <DetailsForm key={`${me.first_name}|${me.last_name}|${me.contact}`} me={me} />
      </div>
    </SectionCard>
    <SectionCard title="Password" description="If an admin gave you a temporary password, change it here.">
      <PasswordForm />
    </SectionCard>
  </div>
)

export default ProfilePanel
