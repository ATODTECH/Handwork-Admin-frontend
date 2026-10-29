import { HandCoins, Handshake, ShieldCheck } from "lucide-react"
import SectionCard from "@/components/account/section-card"
import StepList, { type Step } from "@/components/account/step-list"
import { RELEASE_AFTER_HOURS } from "@/lib/bookings"

const STEPS: Step[] = [
  { icon: Handshake, title: "Agree a price", text: "Your artisan reviews the job and accepts with a final price." },
  { icon: HandCoins, title: "Pay once, safely", text: "You pay Handwork Expert through Paystack, and we hold the money." },
  {
    icon: ShieldCheck,
    title: "Confirm when it's done",
    text: `We only pay the artisan once you confirm, or ${RELEASE_AFTER_HOURS} hours after they finish if you don't report a problem.`,
  },
]

/** How payments work, so customers know what to expect before booking */
const PaySafelyCard = () => (
  <SectionCard title="How paying works" description="Your money is protected until the job is done.">
    <StepList steps={STEPS} />
  </SectionCard>
)

export default PaySafelyCard
