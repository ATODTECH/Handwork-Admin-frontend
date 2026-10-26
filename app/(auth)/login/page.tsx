import { siteMetadata } from "@/lib/site-metadata"
import { SiteLogin } from "@/modules/site/auth"

export const metadata = siteMetadata({
  title: "Login",
  description: "Sign in to your Handwork Expert account to book artisans or manage your jobs.",
  path: "/login",
})

const Login = () => {
  return <SiteLogin />
}

export default Login
