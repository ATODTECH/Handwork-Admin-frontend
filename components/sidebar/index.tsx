"use client"

import { ROUTES } from "@/lib/routes"
import { BellPlus, Book, Headset, Home, ReportsIcon, ServicesIcon, Settings, Settings2, User2, Users2 } from "@/assets"
import { usePathname } from "next/navigation"
import Link from "next/link"

const SideBarHeader = () => {

  const routes = [
    {name:"Dashboard", route:ROUTES.dashboard, icon:Home},
    {name:"User Management", route:ROUTES.users, icon:Users2},
    {name:"Artisans", route:ROUTES.artisans, icon:User2},
    {name:"Services", route:ROUTES.services, icon:ServicesIcon},
    {name:"Bookings", route:ROUTES.bookings, icon:Book},
    {name:"Reports", route:ROUTES.reports, icon:ReportsIcon},
    {name:"Support", route:ROUTES.support, icon:Headset},
    {name:"Notifications", route:ROUTES.notifications, icon:BellPlus},
    {name:"Settings", route:ROUTES.settings, icon:Settings2},
  ]
  const pathname = usePathname()

  return (
    <aside className="flex flex-col gap-y-4 2xl:gap-y-5 h-fit w-full overflow-y-auto scrollbar-thin pt-7.5 pr-2">
      {routes.map((route, index)=> 
        <Link
          key={index}
          href={route.route}
          className={`inline-flex gap-3 px-4 py-3 items-center text-[15px] 2xl:text-base font-normal ${pathname===route.route? " text-hw-secondary rounded-sm bg-[#EFF5FF]": "text-hw-text-neutral"}`}
        >
          {(index===3 || index===5) ?
            <route.icon color={`${pathname===route.route? '#1E338A': '#7D847C'}`} 
            className="h-5 w-5" /> :
            <route.icon size={20} 
            className={`${pathname===route.route? 'text-hw-secondary rounded-sm': ''}`} />
          }
          <span className="inline-flex">{route.name}</span>
        </Link>
      )}
    </aside>
  )
}

export default SideBarHeader