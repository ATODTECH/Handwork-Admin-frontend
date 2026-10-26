import { Metadata } from 'next'
import AdminLogin from '@/modules/admin-login'

export const metadata: Metadata = {
  title: "Login - HandworkExpert",
  description: "Sign in to the HandworkExpert admin console.",
};

const Login = () => {
  return <AdminLogin />
}

export default Login
