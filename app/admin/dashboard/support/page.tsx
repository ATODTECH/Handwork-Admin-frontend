import { Metadata } from "next"
import SupportInboxIndex from "@/modules/support-inbox"

export const metadata: Metadata = {
  title: "Support - HandworkExpert",
}

const SupportPage = () => <SupportInboxIndex />

export default SupportPage
