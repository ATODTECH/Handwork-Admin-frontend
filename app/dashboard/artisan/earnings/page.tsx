import { Metadata } from "next"
import ArtisanEarnings from "@/modules/artisan-dashboard/earnings"

export const metadata: Metadata = {
  title: "Earnings",
}

const ArtisanEarningsPage = () => <ArtisanEarnings />

export default ArtisanEarningsPage
