import { Metadata } from "next"
import MessagesView from "@/components/account/messages/messages-view"

export const metadata: Metadata = {
  title: "Messages",
}

/** `?booking=` opens that booking's conversation */
const ArtisanMessagesPage = async ({ searchParams }: PageProps<"/dashboard/artisan/messages">) => {
  const { booking } = await searchParams
  const bookingId = Number(booking)
  return <MessagesView viewer="artisan" initialBookingId={Number.isInteger(bookingId) && bookingId > 0 ? bookingId : undefined} />
}

export default ArtisanMessagesPage
