import { Metadata } from "next"
import ArtisanReviews from "@/modules/artisan-dashboard/reviews"

export const metadata: Metadata = {
  title: "Reviews",
}

const ArtisanReviewsPage = () => <ArtisanReviews />

export default ArtisanReviewsPage
