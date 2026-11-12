import { Metadata } from "next"
import ReferPage from "@/components/account/referrals/refer-page"

export const metadata: Metadata = {
  title: "Refer & earn",
}

const ReferEarnPage = () => <ReferPage viewer="artisan" />

export default ReferEarnPage
