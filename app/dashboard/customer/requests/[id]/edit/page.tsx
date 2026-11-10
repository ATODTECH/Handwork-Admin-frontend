import { Metadata } from "next"
import { EditRequest } from "@/modules/customer-dashboard/requests/request-editor"

export const metadata: Metadata = {
  title: "Edit request",
}

const EditRequestPage = async ({ params }: PageProps<"/dashboard/customer/requests/[id]/edit">) => {
  const { id } = await params
  return <EditRequest id={Number(id)} />
}

export default EditRequestPage
