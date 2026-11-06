import { Metadata } from "next"
import CustomerPayments from "@/modules/customer-dashboard/payments"

export const metadata: Metadata = {
  title: "Payments",
}

const CustomerPaymentsPage = () => <CustomerPayments />

export default CustomerPaymentsPage
