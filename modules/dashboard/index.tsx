"use client"

import { ROUTES } from "@/lib/routes"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import Link from "next/link"
import GridCard from "./gridcard"
import ArtisanDisputes from "./artisan-disputes"
import RecentUsers from "./recent-users"
import { PageHeader } from "@/components/shared/page-header"

const DashboardOverview = () => {
  const headerTitle = usePageHeading()

  return (
    <section className="flex-1 flex flex-col py-7.5 pr-8 overflow-y-auto scrollbar-thin">
      <PageHeader
        title={headerTitle.title}
        description={headerTitle.description}
        action={(
          <Link
            href={ROUTES.artisans}
            className=" px-7 py-3 2xl:px-9.75 2xl:py-4 rounded-lg bg-[#172153] text-[15px] 2xl:text-base text-hw-base-white"
          >
            Approve Artisan
          </Link>
        )}
      />

      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-center w-full mb-8">
        <GridCard />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 w-full mb-8 gap-4 ">
        <ArtisanDisputes />
      </div>

      <div className="flex flex-col gap-2">
        <RecentUsers />
      </div>
    </section>
  )
}

export default DashboardOverview