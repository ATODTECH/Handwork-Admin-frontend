import { Metadata } from "next"
import BookingsIndex from "@/modules/bookings"

export const metadata: Metadata = {
  title: "Bookings - HandworkExpert",
}

const BookingsPage = () => <BookingsIndex />

export default BookingsPage
