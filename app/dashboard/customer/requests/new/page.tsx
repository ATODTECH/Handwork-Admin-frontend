import { Metadata } from "next"
import { NewRequest } from "@/modules/customer-dashboard/requests/request-editor"

export const metadata: Metadata = {
  title: "Post a request",
}

const NewRequestPage = () => <NewRequest />

export default NewRequestPage
