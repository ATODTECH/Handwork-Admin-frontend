import { Metadata } from "next"
import AccountSettings from "@/modules/account-settings"

export const metadata: Metadata = {
  title: "Profile & settings",
}

const ArtisanSettingsPage = () => <AccountSettings />

export default ArtisanSettingsPage
