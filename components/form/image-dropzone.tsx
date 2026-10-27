"use client"

import { useEffect, useId, useRef, useState } from "react"
import { ImagePlus, X } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import FieldFrame, { fieldErrorId, isFieldInvalid, type FieldFrameProps } from "./field-frame"

interface ImageDropzoneProps extends Omit<FieldFrameProps, "className"> {
  files: File[]
  onFilesChange: (files: File[]) => void
  /** Called when the user first interacts, so the form can mark the field touched */
  onTouch?: () => void
  /** 1 = a single image that gets replaced */
  maxFiles?: number
  accept: readonly string[]
  maxBytes: number
  /** e.g. "JPG, PNG or WEBP, up to 5MB" */
  hint: string
  disabled?: boolean
}

/** A local preview for a picked file; the object URL is released when it unmounts */
const FilePreview = ({ file, onRemove, disabled }: { file: File, onRemove: () => void, disabled?: boolean }) => {
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL must be created and revoked with the effect
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return (
    <li className="group relative aspect-4/3 overflow-hidden rounded-xl border border-hw-border bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, nothing for next/image to optimise */}
      {url && <img src={url} alt={file.name} className="size-full object-cover" />}
      <span className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/60 to-transparent px-2.5 pt-6 pb-1.5 text-xs text-white">
        {file.name}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="icon-xs"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${file.name}`}
        className="absolute top-2 right-2 rounded-full shadow-sm"
      >
        <X />
      </Button>
    </li>
  )
}

/** Click-or-drop image picker with previews, type/size checks and a file limit. */
const ImageDropzone = ({
  name,
  label,
  description,
  error,
  touched,
  files,
  onFilesChange,
  onTouch,
  maxFiles = 1,
  accept,
  maxBytes,
  hint,
  disabled,
}: ImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const hintId = useId()
  const [dragging, setDragging] = useState(false)
  const [rejection, setRejection] = useState<string | null>(null)
  const single = maxFiles === 1
  const canAdd = single || files.length < maxFiles
  const showError = isFieldInvalid({ error, touched }) && !rejection

  const addFiles = (picked: FileList | null) => {
    onTouch?.()
    if (!picked?.length) return
    const all = Array.from(picked)
    const valid = all.filter((file) => accept.includes(file.type) && file.size <= maxBytes)
    const room = single ? 1 : maxFiles - files.length
    const accepted = valid.slice(0, room)

    if (valid.length < all.length) setRejection(`Some files were skipped. Use ${hint}.`)
    else if (valid.length > room) setRejection(`You can add up to ${maxFiles} images.`)
    else setRejection(null)

    if (accepted.length) onFilesChange(single ? accepted : [...files, ...accepted])
  }

  const removeAt = (index: number) => {
    setRejection(null)
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <FieldFrame name={name} label={label} description={description} error={rejection ?? error} touched={touched || !!rejection}>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept={accept.join(",")}
        multiple={!single}
        disabled={disabled}
        className="sr-only"
        aria-describedby={showError || rejection ? fieldErrorId(name) : hintId}
        aria-invalid={showError}
        onChange={(event) => {
          addFiles(event.target.files)
          // Allow picking the same file again after removing it
          event.target.value = ""
        }}
      />

      {files.length > 0 && (
        <ul className={cn("grid gap-3", single ? "max-w-sm grid-cols-1" : "grid-cols-2 sm:grid-cols-3")}>
          {files.map((file, index) => (
            <FilePreview key={`${file.name}-${file.lastModified}-${index}`} file={file} onRemove={() => removeAt(index)} disabled={disabled} />
          ))}
        </ul>
      )}

      {canAdd && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            if (!disabled) addFiles(event.dataTransfer.files)
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-hw-grey-200 bg-hw-grey-200/15 px-4 py-6 text-center transition-colors outline-none",
            "hover:border-hw-secondary/40 hover:bg-secondary/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
            dragging && "border-hw-secondary bg-secondary",
            (showError || rejection) && "border-destructive",
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-hw-secondary shadow-xs">
            <ImagePlus className="size-5" />
          </span>
          <span className="text-sm text-hw-grey-700">
            <span className="font-medium text-hw-primary">{single && files.length ? "Replace image" : "Click to upload"}</span> or drag and drop
          </span>
          <span id={hintId} className="text-xs text-hw-grey-500">
            {hint}
            {!single && ` · ${files.length}/${maxFiles} added`}
          </span>
        </button>
      )}
    </FieldFrame>
  )
}

export default ImageDropzone
