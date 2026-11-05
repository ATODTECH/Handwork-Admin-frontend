"use client"

import { useRef, useState } from "react"
import { Camera } from "lucide-react"
import { UseAvatar } from "@/components/shared/use-avatar"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useUpdateProfile } from "@/hooks/account/use-profile"
import { IMAGE_UPLOAD } from "@/schema/validation-artisan"
import type { AccountDetails } from "@/types/account/profile"

const checkFile = ({ type, size }: File) => {
  if (!(IMAGE_UPLOAD.accept as readonly string[]).includes(type)) return "Choose a JPG, PNG or WEBP image."
  if (size > IMAGE_UPLOAD.maxBytes) return "Choose an image under 5MB."
  return null
}

/** The profile photo: choosing a file uploads it straight away */
const PhotoSection = ({ details }: { details: AccountDetails }) => {
  const { save, isPending } = useUpdateProfile()
  const [error, setError] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const name = `${details.first_name} ${details.last_name}`.trim()

  const upload = async (file: File) => {
    const problem = checkFile(file)
    setError(problem)
    if (problem) return
    const body = new FormData()
    body.append("profile_image", file)
    await save(body).catch((saveError: Error) => setError(saveError.message))
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <UseAvatar src={details.profile_image ?? ""} name={name} aspectRatio="size-20" />
      <div className="flex flex-col gap-1.5">
        <input
          ref={input}
          type="file"
          accept={IMAGE_UPLOAD.accept.join(",")}
          className="sr-only"
          aria-label="Profile photo"
          tabIndex={-1}
          onChange={(event) => {
            const file = event.target.files?.[0]
            // Let the same file be chosen again after an error
            event.target.value = ""
            if (file) void upload(file)
          }}
        />
        <Button type="button" variant="outline" className="w-fit" disabled={isPending} onClick={() => input.current?.click()}>
          {isPending ? <Spinner data-icon="inline-start" /> : <Camera data-icon="inline-start" />}
          {isPending ? "Uploading…" : details.profile_image ? "Change photo" : "Add a photo"}
        </Button>
        {error ? (
          <p role="alert" className="text-xs text-destructive">{error}</p>
        ) : (
          <p className="text-xs text-hw-grey-500">{IMAGE_UPLOAD.label}</p>
        )}
      </div>
    </div>
  )
}

export default PhotoSection
