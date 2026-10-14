"use client"

import LogoIndex from "@/components/logo"
import SideBarHeader from "@/components/sidebar"

const DashboardTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col relative min-w-5xl w-full h-screen">
      <div className="flex items-center justify-between w-full px-8 py-4.5 border-b border-hw-border">
        <LogoIndex />
      </div>
      <div className="flex flow-row h-[calc(100vh-80.17px)]">
        <header className="flex flex-col pb-7.5 pl-2 h-full w-60.25 border-r border-r-hw-grey-200">
          <SideBarHeader />
        </header>
        <div className="flex-1 w-[calc(100vw-15.0625rem)] relative flex flex-col justify-between gap-6 pl-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardTemplate
