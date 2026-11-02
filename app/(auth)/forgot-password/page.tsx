import { siteMetadata } from "@/lib/site-metadata"
import { ForgotPassword } from "@/modules/site/auth/forgot-password"

export const metadata = siteMetadata({
  title: "Reset your password",
  description: "Get a code by email and choose a new password for your Handwork Expert account.",
  path: "/forgot-password",
})

const ForgotPasswordPage = () => {
  return <ForgotPassword />
}

export default ForgotPasswordPage
