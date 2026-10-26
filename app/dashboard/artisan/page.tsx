import { Metadata } from "next"
import { ArtisanOverview } from "@/modules/artisan-dashboard"

export const metadata: Metadata = {
  title: "Artisan dashboard",
}

const ArtisanDashboard = () => <ArtisanOverview />

export default ArtisanDashboard
