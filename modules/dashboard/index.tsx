"use client"

import { HeaderPage, ROUTES } from "@/lib/routes"
import Link from "next/link"
import GridCard from "./gridcard"

const DashboardOverview = () => {
  const headerTitle = HeaderPage()

  return (
    <section className="flex-1 flex flex-col pr-8 overflow-y-auto scrollbar-thin">
      <div className="flex items-center justify-between gap-5 w-full font-medium mb-6">
        <div className="flex flex-col">
          <h5 className="text-xs font-light text-[#626773]">Admin / Dashboard</h5>
          <h1 className=" text-xl 2xl:text-[22px] text-hw-grey-text-900">{headerTitle.title}</h1>
          {headerTitle.description && 
            <h2 className="">{headerTitle.description}</h2>
          }
        </div>
        <Link
          href={ROUTES.artisans}
          className=" px-7 py-3 2xl:px-9.75 2xl:py-4 rounded-lg bg-[#172153] text-[15px] 2xl:text-base text-hw-base-white"
        >
          Approve Artisan
        </Link>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-center w-full">
        <GridCard />
      </div>
    </section>
  )
}

export default DashboardOverview