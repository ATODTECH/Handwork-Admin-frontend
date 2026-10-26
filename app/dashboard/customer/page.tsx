import { Metadata } from "next"
import CustomerOverview from "@/modules/customer-dashboard/overview"

export const metadata: Metadata = {
  title: "Overview",
}

const CustomerDashboard = () => <CustomerOverview />

export default CustomerDashboard
