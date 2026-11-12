import { Metadata } from "next"
import ReportsIndex from "@/modules/reports-analytics"

export const metadata: Metadata = {
  title: "Reports - HandworkExpert",
}

const ReportsPage = () => <ReportsIndex />

export default ReportsPage
