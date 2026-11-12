import { Metadata } from "next"
import StaffSettingsIndex from "@/modules/staff-settings"

export const metadata: Metadata = {
  title: "Settings - HandworkExpert",
}

const SettingsPage = () => <StaffSettingsIndex />

export default SettingsPage
