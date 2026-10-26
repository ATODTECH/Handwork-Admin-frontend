import { siteMetadata } from "@/lib/site-metadata"
import { SiteRegister } from "@/modules/site/auth"

export const metadata = siteMetadata({
  title: "Create an account",
  description: "Join Handwork Expert to book verified artisans near you, or sign up as a professional to get jobs.",
  path: "/register",
})

const Register = async ({ searchParams }: { searchParams: Promise<{ role?: string }> }) => {
  const { role } = await searchParams
  return <SiteRegister role={role === "artisan" ? "ARTISAN" : "USER"} />
}

export default Register
