import { TopBar } from "@/components/site/topbar";
import { Footer } from "@/components/site/footer";

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="font-site flex flex-col justify-between min-h-screen min-w-[320px] max-w-[1920px] mx-auto overflow-hidden bg-primary-white">
      <TopBar />
      <main className="flex flex-col flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default SiteLayout
