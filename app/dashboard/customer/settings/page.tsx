import { Metadata } from "next"
import AccountSettings from "@/modules/account-settings"

export const metadata: Metadata = {
  title: "Profile & settings",
}

const CustomerSettingsPage = () => <AccountSettings />

export default CustomerSettingsPage
