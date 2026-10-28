import { Metadata } from "next"
import ArtisanProfile from "@/modules/customer-dashboard/artisan-profile"

export const metadata: Metadata = {
  title: "Book an artisan",
}

const ArtisanProfilePage = async ({ params }: PageProps<"/dashboard/customer/artisans/[id]">) => {
  const { id } = await params
  return <ArtisanProfile id={id} />
}

export default ArtisanProfilePage
