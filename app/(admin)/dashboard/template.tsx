"use client"

const DashboardTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col relative min-w-5xl w-full h-screen">
      <div className="flex items-center justify-between w-full">
        {/* logo */}
      </div>
      <div className="flex flow-row">
        <aside className="flex gap-y-5 flex-col h-full px-5 py-8 w-60.25">
        </aside>
        <div className="flex-1 w-[calc(100vw-15.0625rem)] relative flex flex-col justify-between gap-6 pl-8 pt-7">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardTemplate
