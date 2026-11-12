import { siteMetadata } from "@/lib/site-metadata"
import { SiteRegister } from "@/modules/site/auth"

export const metadata = siteMetadata({
  title: "Create an account",
  description: "Join Handwork Expert to book verified artisans near you, or sign up as a professional to get jobs.",
  path: "/register",
})

const REFERRAL_CODE = /^[A-Za-z0-9]{4,12}$/

/** `?role=artisan` for professionals; `?ref=CODE` from a friend's invite link */
const Register = async ({ searchParams }: { searchParams: Promise<{ role?: string, ref?: string }> }) => {
  const { role, ref } = await searchParams
  const referralCode = ref && REFERRAL_CODE.test(ref) ? ref.toUpperCase() : undefined
  return <SiteRegister role={role === "artisan" ? "ARTISAN" : "USER"} referralCode={referralCode} />
}

export default Register
