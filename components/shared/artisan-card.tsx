import Link from "next/link"
import { ArrowRight, BadgeCheck, CalendarDays, MapPin } from "lucide-react"
import { UseAvatar } from "@/components/shared/use-avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { availabilityLabel } from "@/lib/artisans"
import { formatLocation } from "@/lib/locations"
import { artisanName, priceRange } from "@/lib/marketplace"
import { customerArtisanRoute } from "@/lib/routes"
import type { PublicArtisan } from "@/types/account/marketplace"

const MAX_SERVICES = 2

export const VerifiedBadge = () => (
  <Badge className="bg-[#E7F6EC] text-hw-text-green-solid">
    <BadgeCheck />
    Verified
  </Badge>
)

/** One approved artisan in the results, linking to their profile and booking form */
const ArtisanCard = ({ artisan }: { artisan: PublicArtisan }) => {
  const { skill } = artisan
  const name = artisanName(artisan)
  const services = skill?.services ?? []
  const cover = skill?.images[0]?.url

  return (
    <Card className="group gap-0 overflow-hidden rounded-2xl p-0 shadow-none ring-hw-border transition-shadow hover:shadow-md">
      <Link href={customerArtisanRoute(artisan.id)} className="flex h-full flex-col outline-none focus-visible:ring-3 focus-visible:ring-hw-primary/50">
        <div className="aspect-video overflow-hidden bg-secondary-blue">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element -- public storage URL, not a configured image host
            <img src={cover} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="size-full bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] bg-size-[16px_16px]" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div className="-mt-12 flex items-end justify-between gap-3">
            <UseAvatar src={artisan.profile_image ?? ""} name={name} aspectRatio="size-16 ring-4 ring-white" />
            <VerifiedBadge />
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-base font-semibold text-hw-grey-900">{name}</h2>
            <p className="flex items-center gap-1.5 text-sm text-hw-grey-500">
              <MapPin className="size-3.5 shrink-0" />
              {formatLocation(artisan) ?? "Location not set"}
            </p>
          </div>

          {services.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {services.slice(0, MAX_SERVICES).map(({ id, name: service }) => (
                <Badge key={id} variant="secondary">{service}</Badge>
              ))}
              {services.length > MAX_SERVICES && <Badge variant="outline">+{services.length - MAX_SERVICES} more</Badge>}
            </div>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-hw-border pt-4">
            {skill ? (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-hw-grey-900 tabular-nums">{priceRange(skill)}</span>
                <span className="flex items-center gap-1.5 text-xs text-hw-grey-500">
                  <CalendarDays className="size-3.5" />
                  {availabilityLabel(skill)}
                </span>
              </div>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-1 text-sm font-medium text-hw-primary">
              View & book
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </Card>
  )
}

export default ArtisanCard
