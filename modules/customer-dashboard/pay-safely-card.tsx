import { HandCoins, Handshake, ShieldCheck } from "lucide-react"
import SectionCard from "@/components/account/section-card"
import StepList, { type Step } from "@/components/account/step-list"
import { DEPOSIT_RATE } from "@/lib/bookings"

const STEPS: Step[] = [
  { icon: Handshake, title: "Agree a price", text: "Your artisan reviews the job and accepts with a final price." },
  { icon: HandCoins, title: `Pay a ${DEPOSIT_RATE * 100}% deposit`, text: "This secures your booking before work starts." },
  { icon: ShieldCheck, title: "Pay the rest when done", text: "The balance is only due once the job is completed." },
]

/** How payments work, so customers know what to expect before booking */
const PaySafelyCard = () => (
  <SectionCard title="How paying works" description="Simple, safe payments through Paystack.">
    <StepList steps={STEPS} />
  </SectionCard>
)

export default PaySafelyCard
