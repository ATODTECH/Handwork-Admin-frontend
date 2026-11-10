import { Metadata } from "next"
import FindWork from "@/modules/artisan-dashboard/find-work"

export const metadata: Metadata = {
  title: "Find work",
}

const FindWorkPage = () => <FindWork />

export default FindWorkPage
