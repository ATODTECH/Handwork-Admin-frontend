"use client"

import { ClipboardX } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import { Skeleton } from "@/components/ui/skeleton"
import { useRequest } from "@/hooks/account/use-requests"
import { isApiError } from "@/lib/http/errors"
import { isEditable } from "@/lib/requests"
import RequestForm from "./request-form"
import { BackToRequests } from "./request-page"

/** Posting a new request */
export const NewRequest = () => (
  <>
    <BackToRequests />
    <PageHeader
      title="Post a request"
      description="Describe what you need. Providers who offer it will send you offers with their price and timing."
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
      <PageHeader title="Edit request" description="Providers who already sent an offer are told, so they can revise it." />
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
