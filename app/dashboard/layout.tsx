import { Metadata } from "next"

// Signed-in areas; `proxy.ts` keeps each role in its own dashboard
export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Handwork Expert" },
  robots: { index: false, follow: false },
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => children

export default DashboardLayout
