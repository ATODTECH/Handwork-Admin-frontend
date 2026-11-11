"use client"

import Link from "next/link"
import { ArrowLeft, CalendarDays, FileText, MapPin, Star, UserRoundX, Wallet } from "lucide-react"
import ReportButton from "@/components/account/reports/report-dialog"
import ProviderReviewsSection from "@/components/account/reviews/provider-reviews-section"
import EmptyState from "@/components/account/empty-state"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { UseAvatar } from "@/components/shared/use-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useArtisan } from "@/hooks/account/use-marketplace"
import { availabilityLabel } from "@/lib/artisans"
import { isApiError } from "@/lib/http/errors"
import { formatLocation } from "@/lib/locations"
import { reviewCountLabel } from "@/lib/reviews"
import { artisanName, priceRange } from "@/lib/marketplace"
import { ACCOUNT_ROUTES, requestQuoteRoute } from "@/lib/routes"
import type { PublicArtisan } from "@/types/account/marketplace"
import { VerifiedBadge } from "@/components/shared/artisan-card"
import BookingForm from "./booking-form"

const BackLink = () => (
  <Button variant="ghost" size="sm" className="-ml-2 w-fit" render={<Link href={ACCOUNT_ROUTES.customerArtisans} />} nativeButton={false}>
    <ArrowLeft data-icon="inline-start" />
    All artisans
  </Button>
)

const Fact = ({ icon: Icon, children }: { icon: typeof MapPin, children: React.ReactNode }) => (
  <span className="flex items-center gap-1.5 text-sm text-hw-grey-700">
    <Icon className="size-4 shrink-0 text-hw-grey-500" />
    {children}
  </span>
)

const ProfileSkeleton = () => (
  <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]" aria-busy="true" aria-label="Loading">
    <Skeleton className="h-[32rem] rounded-2xl" />
    <Skeleton className="h-[36rem] rounded-2xl" />
  </div>
)

const ArtisanDetails = ({ artisan }: { artisan: PublicArtisan }) => {
  const { skill } = artisan
  const name = artisanName(artisan)

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <Card className="rounded-2xl p-6 shadow-none ring-hw-border">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <UseAvatar src={artisan.profile_image ?? ""} name={name} aspectRatio="size-20" className="text-2xl" />
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-hw-grey-900">{name}</h1>
              <VerifiedBadge />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              <Fact icon={MapPin}>{formatLocation(artisan) ?? "Location not set"}</Fact>
              {skill && <Fact icon={Wallet}>{priceRange(skill)}</Fact>}
              {skill && <Fact icon={CalendarDays}>{availabilityLabel(skill)}</Fact>}
              {artisan.review_summary && (
                <Fact icon={Star}>
                  {artisan.review_summary.average === null
                    ? "No reviews yet"
                    : `${artisan.review_summary.average.toFixed(1)} · ${reviewCountLabel(artisan.review_summary.count)}`}
                </Fact>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {skill && (
                <Button render={<Link href={requestQuoteRoute(artisan.id)} />} nativeButton={false}>
                  <FileText data-icon="inline-start" />
                  Request a quote
                </Button>
              )}
              <ReportButton target={{ type: "USER", id: artisan.id }} subject={name} />
            </div>
          </div>
        </div>
      </Card>

      {skill && (
        <SectionCard title="About">
          <div className="flex flex-col gap-5">
            <p className="text-sm leading-relaxed whitespace-pre-line text-hw-grey-700">{skill.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {skill.services.map(({ id, name: service }) => (
                <Badge key={id} variant="secondary">{service}</Badge>
              ))}
            </div>
          </div>
        </SectionCard>
      )}

      {!!skill?.images.length && (
        <SectionCard title="Past work">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {skill.images.map(({ url }, index) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element -- public storage URL, not a configured image host */}
                <img src={url} alt={`Work by ${name}, photo ${index + 1}`} className="size-full object-cover transition-transform hover:scale-105" />
              </a>
            ))}
          </div>
        </SectionCard>
      )}

      <ProviderReviewsSection providerId={artisan.id} />
    </div>
  )
}

/** An approved artisan's public profile, with the form to book them */
const ArtisanProfile = ({ id }: { id: string }) => {
  const { data: artisan, isPending, isError, error, refetch } = useArtisan(id)
  // The API answers 404 for artisans who aren't approved (or don't exist)
  const notFound = isError && isApiError(error) && error.status === 404

  return (
    <>
      <BackLink />
      {notFound ? (
        <EmptyState
          icon={UserRoundX}
          title="This artisan isn't available"
          description="They may not be verified yet, or their profile was removed."
          action={
            <Button render={<Link href={ACCOUNT_ROUTES.customerArtisans} />} nativeButton={false}>
              Find another artisan
            </Button>
          }
        />
      ) : (
        <QueryContent isPending={isPending} isError={isError} onRetry={refetch} isEmpty={!artisan} empty={null} skeleton={<ProfileSkeleton />}>
          {artisan && (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
              <ArtisanDetails artisan={artisan} />
              <SectionCard
                title={`Or book ${artisan.first_name} directly`}
                description="Quick for simple jobs: tell them about it and they'll reply with a final price. For photos, details or to compare terms, request a quote instead."
                className="lg:sticky lg:top-24"
              >
                <BookingForm artisan={artisan} />
              </SectionCard>
            </div>
          )}
        </QueryContent>
      )}
    </>
  )
}

export default ArtisanProfile
