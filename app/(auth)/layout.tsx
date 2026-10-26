import Link from "next/link"
import LogoIndex from "@/components/logo"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="font-site flex min-h-screen items-center justify-center bg-hw-grey-200/40 px-4 py-10">
      <div className="flex w-full max-w-lg flex-col items-center gap-8">
        <Link href="/" aria-label="Back to the home page">
          <LogoIndex />
        </Link>
        {children}
      </div>
    </main>
  )
}

export default AuthLayout
