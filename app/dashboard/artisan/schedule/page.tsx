import { Metadata } from "next"
import ArtisanSchedule from "@/modules/artisan-dashboard/schedule"

export const metadata: Metadata = {
  title: "Schedule",
}

const ArtisanSchedulePage = () => <ArtisanSchedule />

export default ArtisanSchedulePage
