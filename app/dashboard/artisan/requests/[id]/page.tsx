import { Metadata } from "next"
import ProviderRequestPage from "@/modules/artisan-dashboard/find-work/request-page"

export const metadata: Metadata = {
  title: "Request",
}

const ArtisanRequestPage = async ({ params }: PageProps<"/dashboard/artisan/requests/[id]">) => {
  const { id } = await params
  return <ProviderRequestPage id={Number(id)} />
}

export default ArtisanRequestPage
