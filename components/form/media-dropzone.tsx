"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Check, Film, ImagePlus, Lock, LockOpen, X } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import FieldFrame, { fieldErrorId } from "./field-frame"

export type MediaKind = "IMAGE" | "VIDEO"

/** A saved file (`url`) or one picked and not uploaded yet (`file`) */
export interface MediaItem {
  key: string
  kind: MediaKind
  url?: string | null
  file?: File
  /** Hidden from everyone but the provider whose offer is accepted */
  private: boolean
  /** 0–100 while it uploads */
  progress?: number
}

export interface MediaLimits {
  image: { accept: readonly string[], maxBytes: number, max: number }
  video: { accept: readonly string[], maxBytes: number, max: number }
  hint: string
}

interface MediaDropzoneProps {
  name: string
  label: string
  description?: string
  items: MediaItem[]
  limits: MediaLimits
  onAdd: (files: { file: File, kind: MediaKind }[]) => void
  onRemove: (key: string) => void
  /** Only for files not uploaded yet: the API can't change a saved file's privacy */
  onTogglePrivate: (key: string) => void
  disabled?: boolean
}

const kindOf = (type: string, limits: MediaLimits): MediaKind | null =>
  limits.image.accept.includes(type) ? "IMAGE" : limits.video.accept.includes(type) ? "VIDEO" : null

/** A preview URL: the saved file's, or a local one for a picked file, released when it unmounts */
const usePreviewUrl = (item: MediaItem) => {
  const [localUrl, setLocalUrl] = useState<string>()
  useEffect(() => {
    if (!item.file) return
    const objectUrl = URL.createObjectURL(item.file)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL must be created and revoked with the effect
    setLocalUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [item.file])
  return item.file ? localUrl : item.url ?? undefined
}

interface TileProps {
  item: MediaItem
  index: number
  onRemove: () => void
  onTogglePrivate: () => void
  disabled?: boolean
}

const MediaTile = ({ item, index, onRemove, onTogglePrivate, disabled }: TileProps) => {
  const url = usePreviewUrl(item)
  const label = item.file?.name ?? `${item.kind === "VIDEO" ? "Video" : "Photo"} ${index + 1}`
  const uploading = item.progress !== undefined && item.progress < 100
  const saved = !item.file

  return (
    <li className="flex flex-col gap-2">
      <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-hw-border bg-muted">
        {url && item.kind === "IMAGE" && (
          // eslint-disable-next-line @next/next/no-img-element -- a local blob or a signed storage link
          <img src={url} alt={label} className="size-full object-cover" />
        )}
        {url && item.kind === "VIDEO" && (
          <video src={url} className="size-full object-cover" muted playsInline preload="metadata" aria-label={label} />
        )}
        {item.kind === "VIDEO" && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">
            <Film className="size-3" /> Video
          </span>
        )}
        <Button
          type="button"
          variant="secondary"
          size="icon-xs"
          onClick={onRemove}
          disabled={disabled || uploading}
          aria-label={`Remove ${label}`}
          className="absolute top-2 right-2 rounded-full shadow-sm"
        >
          <X />
        </Button>
        {item.progress === 100 && (
          <span className="absolute right-2 bottom-2 flex size-6 items-center justify-center rounded-full bg-hw-text-green-solid text-white">
            <Check className="size-3.5" />
            <span className="sr-only">Uploaded</span>
          </span>
        )}
      </div>
      {uploading && <Progress value={item.progress ?? null} aria-label={`Uploading ${label}`} />}
      <button
        type="button"
        onClick={onTogglePrivate}
        disabled={disabled || saved}
        aria-pressed={item.private}
        className={cn(
          "flex w-fit items-center gap-1.5 rounded-md text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          item.private ? "font-medium text-hw-secondary" : "text-hw-grey-500",
          saved ? "cursor-default" : "hover:text-hw-grey-900",
        )}
      >
        {item.private ? <Lock className="size-3.5" /> : <LockOpen className="size-3.5" />}
        {item.private ? "Private" : saved ? "Visible to providers" : "Visible to providers · make private"}
      </button>
    </li>
  )
}

/**
 * Photos and videos for a request: click or drop, previews, type/size/count checks, a private switch per file
 * and upload progress. The form uploads the files; this only shows them.
 */
const MediaDropzone = ({ name, label, description, items, limits, onAdd, onRemove, onTogglePrivate, disabled }: MediaDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const hintId = useId()
  const [dragging, setDragging] = useState(false)
  const [rejection, setRejection] = useState<string | null>(null)
  const images = items.filter(({ kind }) => kind === "IMAGE").length
  const videos = items.filter(({ kind }) => kind === "VIDEO").length
  const canAdd = images < limits.image.max || videos < limits.video.max

  const addFiles = (picked: FileList | null) => {
    if (!picked?.length) return
    const room = { IMAGE: limits.image.max - images, VIDEO: limits.video.max - videos }
    const accepted: { file: File, kind: MediaKind }[] = []
    const problems = new Set<string>()

    for (const file of Array.from(picked)) {
      const kind = kindOf(file.type, limits)
      if (!kind) {
        problems.add(`Some files were skipped. Use ${limits.hint}.`)
      } else if (file.size > (kind === "IMAGE" ? limits.image.maxBytes : limits.video.maxBytes)) {
        problems.add(`Some files were too big. Use ${limits.hint}.`)
      } else if (room[kind] <= 0) {
        problems.add(`You can add up to ${limits.image.max} photos and ${limits.video.max} videos.`)
      } else {
        room[kind] -= 1
        accepted.push({ file, kind })
      }
    }
    setRejection(problems.size ? [...problems].join(" ") : null)
    if (accepted.length) onAdd(accepted)
  }

  return (
    <FieldFrame name={name} label={label} description={description} error={rejection ?? undefined} touched={!!rejection}>
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept={[...limits.image.accept, ...limits.video.accept].join(",")}
        multiple
        disabled={disabled}
        className="sr-only"
        aria-describedby={rejection ? fieldErrorId(name) : hintId}
        onChange={(event) => {
          addFiles(event.target.files)
          event.target.value = ""
        }}
      />

      {items.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => (
            <MediaTile
              key={item.key}
              item={item}
              index={index}
              onRemove={() => {
                setRejection(null)
                onRemove(item.key)
              }}
              onTogglePrivate={() => onTogglePrivate(item.key)}
              disabled={disabled}
            />
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
            rejection && "border-destructive",
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-hw-secondary shadow-xs">
            <ImagePlus className="size-5" />
          </span>
          <span className="text-sm text-hw-grey-700">
            <span className="font-medium text-hw-primary">Click to upload</span> or drag and drop
          </span>
          <span id={hintId} className="text-xs text-hw-grey-500">
            {limits.hint} · {images}/{limits.image.max} photos, {videos}/{limits.video.max} videos
          </span>
        </button>
      )}
    </FieldFrame>
  )
}

export default MediaDropzone
