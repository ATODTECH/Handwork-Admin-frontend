import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

/** "View all →" in a section card's corner */
const ViewAllLink = ({ href, label = "View all" }: { href: string, label?: string }) => (
  <Button variant="link" size="sm" className="h-auto px-0" render={<Link href={href} />} nativeButton={false}>
    {label}
    <ArrowRight data-icon="inline-end" />
  </Button>
)

export default ViewAllLink
