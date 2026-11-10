import { Metadata } from "next"
import CustomerRequests from "@/modules/customer-dashboard/requests"

export const metadata: Metadata = {
  title: "My requests",
}

const CustomerRequestsPage = () => <CustomerRequests />

export default CustomerRequestsPage
