import { CalendarDays, Film, Lock, MapPin, Timer, Wallet } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { formatNairaAmount, formatSchedule } from "@/lib/format"
import { formatLocation } from "@/lib/locations"
import { budgetLabel, FULFILMENT_OPTIONS, urgencyLabel } from "@/lib/requests"
import type { Fulfilment, RequestAttachment, RequestDetails, Urgency } from "@/types/account/requests"

export const Fact = ({ icon: Icon, label, children }: { icon: LucideIcon, label: string, children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-hw-grey-700">
      <Icon className="size-4" />
    </span>
    <div className="flex min-w-0 flex-col">
      <span className="text-xs text-hw-grey-500">{label}</span>
      <span className="text-sm text-hw-grey-900">{children}</span>
    </div>
  </div>
)

/** A request's photos (open full size) and videos (play in place), with private ones marked */
export const MediaGallery = ({ attachments }: { attachments: RequestAttachment[] }) => (
  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
    {attachments.map((attachment, index) => (
      <li key={attachment.id} className="relative aspect-4/3 overflow-hidden rounded-xl border border-hw-border bg-muted">
        {attachment.url && attachment.kind === "IMAGE" && (
          <a href={attachment.url} target="_blank" rel="noreferrer" className="block size-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- a signed storage link */}
            <img src={attachment.url} alt={`Photo ${index + 1}`} className="size-full object-cover" />
          </a>
        )}
        {attachment.url && attachment.kind === "VIDEO" && (
          <video src={attachment.url} controls playsInline preload="metadata" className="size-full bg-black object-contain" aria-label={`Video ${index + 1}`} />
        )}
        <div className="pointer-events-none absolute top-2 left-2 flex gap-1">
          {attachment.kind === "VIDEO" && (
            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">
              <Film className="size-3" /> Video
            </span>
          )}
          {attachment.private && (
            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">
              <Lock className="size-3" /> Private
            </span>
          )}
        </div>
      </li>
    ))}
  </ul>
)

/** The category-specific details, e.g. size or vehicle make */
export const DetailsGrid = ({ details }: { details: RequestDetails }) => {
  const entries = Object.entries(details)
  if (!entries.length) return null
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-lg bg-muted/60 px-3 py-2">
          <dt className="text-xs text-hw-grey-500">{key}</dt>
          <dd className="text-sm text-hw-grey-900">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

interface WhereAndWhenProps {
  fulfilment: Fulfilment
  state: string
  city: string
  /** Hidden from providers until their offer is accepted */
  address: string | null
  budget_min: string | null
  budget_max: string | null
  budget_flexible: boolean
  deadline: string | null
  urgency: Urgency
}

/** Where the job is, the budget, when it's needed and how urgent it is */
export const WhereAndWhen = ({ request, addressHint }: { request: WhereAndWhenProps, addressHint?: string }) => {
  const fulfilment = FULFILMENT_OPTIONS.find(({ value }) => value === request.fulfilment)?.label
  const area = formatLocation(request)
  const where = request.fulfilment === "REMOTE" ? "Remote" : [request.address, area].filter(Boolean).join(", ")

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Fact icon={MapPin} label={fulfilment ?? "Where"}>
        {where || "Not set"}
        {addressHint && !request.address && request.fulfilment === "ON_SITE" && (
          <span className="block text-xs text-hw-grey-500">{addressHint}</span>
        )}
      </Fact>
      <Fact icon={Wallet} label="Budget">{budgetLabel(request, formatNairaAmount)}</Fact>
      <Fact icon={CalendarDays} label="Needed by">{request.deadline ? formatSchedule(request.deadline) : "No date set"}</Fact>
      <Fact icon={Timer} label="Urgency">{urgencyLabel(request.urgency)}</Fact>
    </div>
  )
}
