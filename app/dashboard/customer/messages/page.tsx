import { Metadata } from "next"
import MessagesView from "@/components/account/messages/messages-view"
import { bookingChatKey, REQUEST_CHAT_KEY } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Messages",
}

/** `?booking=` opens that booking's conversation, `?chat=r<request>-<provider>` a request's */
const CustomerMessagesPage = async ({ searchParams }: PageProps<"/dashboard/customer/messages">) => {
  const { booking, chat } = await searchParams
  const bookingId = Number(booking)
  const initialKey = Number.isInteger(bookingId) && bookingId > 0
    ? bookingChatKey(bookingId)
    : typeof chat === "string" && REQUEST_CHAT_KEY.test(chat) ? chat : undefined
  return <MessagesView viewer="customer" initialKey={initialKey} />
}

export default CustomerMessagesPage
