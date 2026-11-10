import { Metadata } from "next"
import MyOffers from "@/modules/artisan-dashboard/find-work/my-offers"

export const metadata: Metadata = {
  title: "My offers",
}

const MyOffersPage = () => <MyOffers />

export default MyOffersPage
