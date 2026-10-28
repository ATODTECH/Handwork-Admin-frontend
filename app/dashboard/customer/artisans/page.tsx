import { Metadata } from "next"
import FindArtisan from "@/modules/customer-dashboard/find-artisan"

export const metadata: Metadata = {
  title: "Find an artisan",
}

/** `?category=` comes from the overview's category tiles */
const FindArtisanPage = async ({ searchParams }: PageProps<"/dashboard/customer/artisans">) => {
  const { category } = await searchParams
  return <FindArtisan initialCategory={typeof category === "string" ? category : undefined} />
}

export default FindArtisanPage
