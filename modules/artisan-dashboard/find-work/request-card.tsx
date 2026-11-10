"use client"

import Link from "next/link"
import { Bookmark, CalendarDays, Film, ImageIcon, Lock, MapPin, Send, Zap } from "lucide-react"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSaveRequest } from "@/hooks/account/use-provider-requests"
import { formatActivityDate, formatNairaAmount, formatSchedule } from "@/lib/format"
import { formatLocation } from "@/lib/locations"
import { budgetLabel } from "@/lib/requests"
import { artisanRequestRoute } from "@/lib/routes"
import type { ProviderRequest } from "@/types/account/requests"
import ProviderOfferBadge from "./provider-offer-badge"

/** One open request in the provider's feed */
const RequestCard = ({ request }: { request: ProviderRequest }) => {
  const save = useSaveRequest()
  const images = request.attachments.filter(({ kind }) => kind === "IMAGE").length
  const videos = request.attachments.length - images
  const where = request.fulfilment === "REMOTE" ? "Remote" : formatLocation(request)

  return (
    <li className="relative flex flex-col gap-3 rounded-xl border border-hw-border p-4 transition-colors hover:bg-muted/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {request.private && (
              <Badge className="bg-[#EFF5FF] text-hw-secondary">
                <Lock /> Sent to you
              </Badge>
            )}
            {request.urgency === "URGENT" && (
              <Badge className="bg-[#FFF0EF] text-[#C2271D]">
                <Zap /> Urgent
              </Badge>
            )}
            {request.my_offer && <ProviderOfferBadge offer={request.my_offer} />}
          </div>
          <Link
            href={artisanRequestRoute(request.id)}
            className="font-medium text-hw-grey-900 outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
          >
            {request.title}
          </Link>
          <div className="flex flex-wrap gap-1.5">
            {request.services.map(({ id, name }) => (
              <Badge key={id} variant="secondary">{name}</Badge>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative z-10 shrink-0"
          aria-label={request.saved ? "Remove from saved" : "Save for later"}
          aria-pressed={request.saved}
          disabled={save.isPending}
          onClick={() => save.mutate({ id: request.id, saved: !request.saved })}
        >
          <Bookmark className={cn(request.saved && "fill-hw-secondary text-hw-secondary")} />
        </Button>
      </div>

      <p className="line-clamp-2 text-sm text-hw-grey-700">{request.description}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-hw-grey-500">
        <span className="font-medium text-hw-grey-900">{budgetLabel(request, formatNairaAmount)}</span>
        {where && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {where}
          </span>
        )}
        {request.deadline && (
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            By {formatSchedule(request.deadline)}
          </span>
        )}
        {images > 0 && (
          <span className="flex items-center gap-1">
            <ImageIcon className="size-3.5" />
            {images}
          </span>
        )}
        {videos > 0 && (
          <span className="flex items-center gap-1">
            <Film className="size-3.5" />
            {videos}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Send className="size-3.5" />
          {request.offer_count} {request.offer_count === 1 ? "offer" : "offers"}
        </span>
        {request.published_at && <span>{formatActivityDate(request.published_at)}</span>}
      </div>
    </li>
  )
}

export default RequestCard
