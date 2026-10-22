import { MapPin, Monitor } from "lucide-react"
import { categoriesHero } from "@/assets/site"
import { PageHero } from "@/components/site/page-hero"

const popularServices = [
  { name: "Fashion and design.. wholesalers and retailers" },
  { name: "Fashion", highlighted: true },
  { name: "Fumigation and General cleaning services" },
  { name: "Logistics and warehousing" },
  { name: "Makeup artist" },
]

export const ForegroundCategories = () => (
  <PageHero image={categoriesHero} imageAlt="Professional tradesperson at work" className="">
    <div className="flex flex-col justify-end items-center text-center text-primary-text relative z-10 w-full">
      <div className="max-w-[80%] lg:max-w-2xl py-10 425xl:py-20 md:py-30 lg:pt-40 lg:pb-21">
        <h1 className="text-4xl 425xl:text-5xl sm:text-6xl lg:text-[4rem] font-bold leading-tight text-primary-white">What can we do for you today?</h1>
      </div>

      {/* search isn't wired to an API yet */}
      <div className="flex justify-between md:grid grid-cols-2 place-content-center bg-primary-white rounded-[20px] sm:rounded-full 425xl:max-w-[90%] sm:max-w-full w-full px-2 lg:h-17.5 md:px-4 md:py-2 lg:p-5 mb-10">
        <div className="flex relative flex-1">
          <div className="hidden lg:flex absolute top-[30%] left-2">
            <Monitor size={20} className="text-[#858585]" />
          </div>
          <input type="search" id="search" name="search" autoFocus placeholder="What are you looking for?" className="text-[1rem] placeholder:text-[#858585] placeholder:text-sm lg:placeholder:text-[1rem] border-r-0 md:border-r-[1.5px] border-r-[#858585] lg:pl-10 p-3 w-full outline-0 ring-0 [&::-webkit-search-cancel-button]:hidden [&::-ms-clear]:hidden" />
        </div>
        <div className="flex items-center justify-between gap-2 select-none">
          <div className="hidden md:flex truncate items-center ml-4">
            <MapPin size={20} className="shrink-0 text-[#858585]" />
            <span className="ml-2 font-medium text-sm truncate">3 Agbo Akomolafe St, Isheri Olofin Lagos</span>
          </div>
          <button type="submit" className="rounded-[20px] sm:rounded-full py-1.5 px-3 md:py-3 md:px-6 lg:px-8 bg-secondary-orange font-extrabold tracking-wide text-[.75rem] lg:text-[1rem] text-primary-white cursor-pointer">Search</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-start text-primary-white w-full md:max-w-[80%]">
        <h4 className="flex flex-nowrap justify-center mb-4 lg:mb-0 md:justify-end w-full md:max-w-[20%] items-center p-0.5 lg:py-2.5 px-1 gap-1.5 rounded-full">
          <span className="inline-flex shrink-0 bg-[#F5B946] h-1.5 w-1.5 lg:h-3 lg:w-3 rounded-full"></span>
          <span className="font-semibold text-[.75rem] md:text-sm">Popular Services</span>
        </h4>
        <div className="flex flex-wrap justify-center font-medium text-[.652rem] md:text-sm w-full gap-2 md:max-w-[80%]">
          {popularServices.map((service) => (
            <h4
              key={service.name}
              className={`inline-flex rounded-full py-1 px-1.5 lg:py-2.5 lg:px-5 ${service.highlighted ? "bg-secondary-orange" : "border-[1.5px] border-dashed border-primary-white"}`}
            >
              {service.name}
            </h4>
          ))}
        </div>
      </div>
    </div>
  </PageHero>
)
