import { Metadata } from "next"
import CustomerBookings from "@/modules/customer-dashboard/bookings"

export const metadata: Metadata = {
  title: "My bookings",
}

const CustomerBookingsPage = () => <CustomerBookings />

export default CustomerBookingsPage
