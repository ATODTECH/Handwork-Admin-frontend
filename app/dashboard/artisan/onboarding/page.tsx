import { Metadata } from "next"
import { ArtisanOnboarding } from "@/modules/artisan-dashboard"

export const metadata: Metadata = {
  title: "Finish setting up",
}

const ArtisanOnboardingPage = () => <ArtisanOnboarding />

export default ArtisanOnboardingPage
