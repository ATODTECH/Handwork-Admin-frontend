import { Metadata } from "next"
import PayoutsIndex from "@/modules/payouts"

export const metadata: Metadata = {
  title: "Payouts - HandworkExpert",
}

const PayoutsPage = () => <PayoutsIndex />

export default PayoutsPage
