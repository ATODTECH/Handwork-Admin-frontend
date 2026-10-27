import { Metadata } from "next"
import ArtisanVerificationIndex from "@/modules/artisan-verification"

export const metadata: Metadata = {
  title: "Artisans - HandworkExpert",
}

const ArtisansPage = () => <ArtisanVerificationIndex />

export default ArtisansPage
