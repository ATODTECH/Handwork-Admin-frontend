import Link from "next/link"
import { CalendarPlus } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import { Button } from "@/components/ui/button"

/** Empty bookings, with the way out */
const NoBookingsYet = ({ title = "No bookings yet" }: { title?: string }) => (
  <EmptyState
    icon={CalendarPlus}
    title={title}
    description="Find a verified artisan for anything from plumbing to tailoring, and track the job right here."
    action={
      <Button render={<Link href="/categories" />} nativeButton={false}>
        Book your first artisan
      </Button>
    }
  />
)

export default NoBookingsYet
