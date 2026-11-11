import { Metadata } from "next"
import { NewRequest } from "@/modules/customer-dashboard/requests/request-editor"

export const metadata: Metadata = {
  title: "Post a request",
}

/** `?provider=<id>` makes it a quote request sent only to that provider */
const NewRequestPage = async ({ searchParams }: PageProps<"/dashboard/customer/requests/new">) => {
  const { provider } = await searchParams
  return <NewRequest providerId={typeof provider === "string" && provider ? provider : undefined} />
}

export default NewRequestPage
