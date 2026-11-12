import { Metadata } from "next"
import StaffNotificationsIndex from "@/modules/staff-notifications"

export const metadata: Metadata = {
  title: "Notifications - HandworkExpert",
}

const NotificationsPage = () => <StaffNotificationsIndex />

export default NotificationsPage
