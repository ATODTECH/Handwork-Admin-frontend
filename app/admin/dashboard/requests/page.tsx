import { Metadata } from "next"
import RequestsModerationIndex from "@/modules/requests-moderation"

export const metadata: Metadata = {
  title: "Requests and offers - HandworkExpert",
}

const RequestsPage = () => <RequestsModerationIndex />

export default RequestsPage
