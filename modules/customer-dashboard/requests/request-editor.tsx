"use client"

import Link from "next/link"
import { ArrowLeft, ClipboardX, Lock, UserRoundX } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import { UseAvatar } from "@/components/shared/use-avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useArtisan } from "@/hooks/account/use-marketplace"
import { useRequest } from "@/hooks/account/use-requests"
import { isApiError } from "@/lib/http/errors"
import { artisanName } from "@/lib/marketplace"
import { isEditable } from "@/lib/requests"
import { ACCOUNT_ROUTES, customerArtisanRoute } from "@/lib/routes"
import RequestForm from "./request-form"
import { BackToRequests } from "./request-page"

/** "Request a quote": the same form, sent privately to one provider */
const QuoteRequest = ({ providerId }: { providerId: string }) => {
  const { data: provider, isPending, isError, error, refetch } = useArtisan(providerId)
  // The API answers 404 for providers who aren't approved (or don't exist)
  const unavailable = (isError && isApiError(error) && error.status === 404) || (provider && !provider.skill)

  return (
    <>
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" render={<Link href={customerArtisanRoute(providerId)} />} nativeButton={false}>
        <ArrowLeft data-icon="inline-start" />
        Back to profile
      </Button>
      {unavailable ? (
        <EmptyState
          icon={UserRoundX}
          title="This artisan isn't available"
          description="They may not be verified yet. You can post your request to every matching artisan instead."
          action={
            <Button render={<Link href={ACCOUNT_ROUTES.customerNewRequest} />} nativeButton={false}>
              Post a request
            </Button>
          }
        />
      ) : (
        <QueryContent isPending={isPending} isError={isError} onRetry={refetch} isEmpty={!provider} empty={null} skeleton={<Skeleton className="h-[40rem] rounded-2xl" />}>
          {provider?.skill && (
            <>
              <PageHeader
                title={`Request a quote from ${provider.first_name}`}
                description={`Describe the job. ${provider.first_name} replies with an offer: their price, timing and what's included. Nothing is agreed until you accept it.`}
              />
              <Card className="flex-row items-center gap-3 rounded-2xl p-4 shadow-none ring-hw-border">
                <UseAvatar src={provider.profile_image ?? ""} name={artisanName(provider)} aspectRatio="size-11" className="text-sm" />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-hw-grey-900">{artisanName(provider)}</span>
                  <span className="flex items-center gap-1 text-xs text-hw-grey-500">
                    <Lock className="size-3" />
                    Only {provider.first_name} will see this request. Other artisans won&apos;t.
                  </span>
                </div>
              </Card>
              <RequestForm
                provider={{ id: provider.id, firstName: provider.first_name, serviceIds: provider.skill.services.map(({ id }) => id) }}
              />
            </>
          )}
        </QueryContent>
      )}
    </>
  )
}

/** Posting a new request, or with `providerId`, requesting a quote from one provider */
export const NewRequest = ({ providerId }: { providerId?: string }) =>
  providerId ? (
    <QuoteRequest providerId={providerId} />
  ) : (
    <>
      <BackToRequests />
      <PageHeader
        title="Post a request"
        description="Describe what you need. Artisans who offer it will send you offers with their price and timing."
      />
      <RequestForm />
    </>
  )

/** Editing a request that hasn't had an offer accepted */
export const EditRequest = ({ id }: { id: number }) => {
  const { data: request, isPending, isError, error, refetch } = useRequest(id)
  const notFound = isError && isApiError(error) && error.status === 404

  return (
    <>
      <BackToRequests />
      <PageHeader title="Edit request" description="Artisans who already sent an offer are told, so they can revise it." />
      {notFound ? (
        <EmptyState icon={ClipboardX} title="We couldn't find this request" description="It may have been deleted." />
      ) : (
        <QueryContent
          isPending={isPending}
          isError={isError}
          onRetry={refetch}
          isEmpty={!request}
          empty={null}
          skeleton={<Skeleton className="h-[40rem] rounded-2xl" />}
        >
          {request &&
            (isEditable(request) ? (
              <RequestForm request={request} />
            ) : (
              <EmptyState
                icon={ClipboardX}
                title="This request can't be changed"
                description="It's closed, or you've already accepted an offer."
              />
            ))}
        </QueryContent>
      )}
    </>
  )
}
