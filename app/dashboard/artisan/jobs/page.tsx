import { Metadata } from "next"
import ArtisanJobs from "@/modules/artisan-dashboard/jobs"

export const metadata: Metadata = {
  title: "Job requests",
}

const ArtisanJobsPage = () => <ArtisanJobs />

export default ArtisanJobsPage
