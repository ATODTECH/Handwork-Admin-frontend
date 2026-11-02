import { Metadata } from "next"
import MessagesView from "@/components/account/messages/messages-view"

export const metadata: Metadata = {
  title: "Messages",
}

/** `?booking=` opens that booking's conversation */
const CustomerMessagesPage = async ({ searchParams }: PageProps<"/dashboard/customer/messages">) => {
  const { booking } = await searchParams
  const bookingId = Number(booking)
  return <MessagesView viewer="customer" initialBookingId={Number.isInteger(bookingId) && bookingId > 0 ? bookingId : undefined} />
}

export default CustomerMessagesPage
