import { usePathname } from "next/navigation"
import { PAGE_HEADINGS } from "@/lib/routes"

/** Title/description for the current admin page */
export const usePageHeading = () => {
  const pathname = usePathname()
  return PAGE_HEADINGS[pathname]
}
