"use client"

import { useCallback } from "react"
import ChatPanel from "@/components/account/requests/chat-panel"
import { UseAvatar } from "@/components/shared/use-avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useMarkRequestThreadRead, useRequestThread, useSendRequestMessage } from "@/hooks/account/use-requests"
import type { OfferProvider } from "@/types/account/requests"

interface RequestChatSheetProps {
  requestId: number
  requestTitle: string
  provider: OfferProvider | null
  onOpenChange: (open: boolean) => void
}

/** The customer's chat with one provider about a request, before an offer is accepted */
const RequestChatSheet = ({ requestId, requestTitle, provider, onOpenChange }: RequestChatSheetProps) => {
  const providerId = provider?.id ?? ""
  const thread = useRequestThread(requestId, providerId, provider !== null)
  const send = useSendRequestMessage()
  const { mutate: markRead, isPending: marking } = useMarkRequestThreadRead()
  const onUnread = useCallback(() => {
    if (providerId && !marking) markRead({ requestId, providerId })
  }, [providerId, marking, markRead, requestId])

  return (
    <Sheet open={provider !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        {provider && (
          <>
            <SheetHeader className="flex-row items-center gap-3 border-b border-hw-grey-200 px-5 py-4">
              <UseAvatar src={provider.profile_image ?? ""} name={provider.name} aspectRatio="size-10" className="text-sm" />
              <div className="flex min-w-0 flex-col">
                <SheetTitle className="truncate text-base">{provider.name}</SheetTitle>
                <SheetDescription className="truncate">{requestTitle}</SheetDescription>
              </div>
            </SheetHeader>
            <ChatPanel
              className="flex-1 px-4 pb-3"
              thread={thread.data}
              isPending={thread.isPending}
              isError={thread.isError}
              onRetry={thread.refetch}
              onSend={(text, done) => send.mutate({ requestId, providerId, text }, { onSuccess: done })}
              sending={send.isPending}
              sendError={send.error?.message ?? null}
              onUnread={onUnread}
              emptyText={`Ask ${provider.name.split(" ")[0]} about their offer before you decide.`}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default RequestChatSheet
