import { Metadata } from "next"
import RequestPage from "@/modules/customer-dashboard/requests/request-page"

export const metadata: Metadata = {
  title: "Request",
}

const CustomerRequestPage = async ({ params }: PageProps<"/dashboard/customer/requests/[id]">) => {
  const { id } = await params
  return <RequestPage id={Number(id)} />
}

export default CustomerRequestPage
