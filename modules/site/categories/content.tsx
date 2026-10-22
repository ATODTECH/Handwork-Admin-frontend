"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  agriculture, automotive, clothingStore, exportServices, homesProperty, logisticsWarehousing, techIT,
} from "@/assets/site"
import { Pagination } from "@/components/site/pagination"

const caption = "ATOD TECH offers a diverse array of expertly crafted services, seamlessly merging creativity."
const brands = ["Happiness store", "Grace kampala", "Joyce store", "Anointed store", "G&D gadgets", "Kano price"]

// placeholder data until the categories API is wired up
const categories = [
  { name: "fashion", icon: clothingStore, category: "Fashion And Beauty", caption, brands },
  { name: "export", icon: exportServices, category: "Export Services", caption, brands },
  { name: "property", icon: homesProperty, category: "Home And Property", caption, brands },
  { name: "logistics", icon: logisticsWarehousing, category: "Logistics And Warehousing", caption, brands },
  { name: "tech-IT", icon: techIT, category: "Tech/IT", caption, brands },
  { name: "automotive", icon: automotive, category: "Automotive", caption, brands },
  { name: "agriculture", icon: agriculture, category: "Agriculture", caption, brands },
]

const PAGE_SIZE = 5

const BrandTicker = ({ brands }: { brands: string[] }) => {
  // rendered twice so the -50% marquee loops seamlessly
  const row = (
    <div className="flex whitespace-nowrap gap-4">
      {brands.map((brand, i) => (
        <span key={brand} className="flex items-center gap-4 text-[1rem]">
          <span className="text-sm font-medium text-[#F3F5FF] hover:text-secondary-orange">{brand}</span>
          <span className={`text-sm text-primary-white ${i === brands.length - 1 ? "mr-4" : ""}`}>|</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="flex flex-wrap select-none relative w-full sm:max-w-[90%] lg:w-fit overflow-hidden rounded-[.625rem] bg-secondary-blue px-6 py-4 z-0">
      <div className="absolute w-10 h-auto inset-0 left-0 bg-linear-to-r from-secondary-blue via-secondary-blue to-[#151327]/0 z-20"></div>
      <div className="flex w-max marquee-content" style={{ "--char-count": brands.length } as React.CSSProperties}>
        {row}
        {row}
      </div>
      <div className="flex absolute w-full h-full top-0 left-0 justify-end pointer-events-none">
        <div className="w-10 h-full bg-linear-to-l to-[#151327]/0 via-secondary-blue from-secondary-blue z-20"></div>
      </div>
    </div>
  )
}

export const CategoriesContent = () => {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(categories.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const visible = categories.slice(start, start + PAGE_SIZE)

  return (
    <section className="w-full flex items-center relative px-4 p-16 sm:px-16 xl:px-28 bg-primary-white">
      <div className="flex flex-col gap-30 items-center w-full my-16">
        <div className="flex flex-col items-center w-full max-w-[90%]">
          <h3 className="font-semibold text-center text-2xl 425xl:text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-14 text-secondary-orange w-[80%] lg:w-[70%] mb-6.25">Discover Our Full Range Of Services</h3>
          <p className="text-[#858585] tracking-[2%] text-center text-[1rem]">
            Artisan’s Attic offers a diverse array of expertly crafted services, seamlessly  merging creativity and technology to deliver solutions that exceed and drive digital success
          </p>
        </div>
        <div className="flex flex-col 425xl:items-center sm:items-start text-primary-text w-full gap-13.25">
          {visible.map((item) => (
            <div key={item.name} id={item.name} className="flex justify-end h-full min-h-16 py-5 px-4.25 shadow-[0px_0px_4px_2px_#E6E6E640] rounded-[1.25rem] 425xl:max-w-[80%] sm:max-w-full">
              <div className="flex flex-col justify-end w-full sm:max-w-[60%] pb-10">
                <div className="flex items-center mb-4 gap-4 lg:gap-2">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <Image src={item.icon} alt={item.category} fill sizes="48px" className="object-cover" />
                  </div>
                  <span className="text-[1rem] leading-6 tracking-[1.5%] font-bold">{item.category}</span>
                </div>
                <p className="text-[1rem] leading-6 font-medium w-full sm:w-[80%] lg:w-[70%] mb-10">{item.caption}</p>
                <BrandTicker brands={item.brands} />
              </div>
              <div className="hidden sm:flex relative h-fit lg:h-auto sm:w-[35%] max-w-[40%] rounded-2xl overflow-hidden">
                <Image src={item.icon} alt={item.category} className="h-full w-full object-cover" />
                <div className="absolute h-full w-full bg-[#17215333] top-0"></div>
                <Link
                  href={`/categories/${item.name}`}
                  className="hidden lg:flex absolute bottom-5 left-1/2 -translate-x-1/2 bg-secondary-orange text-primary-white py-1.75 px-5 text-[.75rem] tracking-[2%] font-bold rounded-full leading-6 outline-0 cursor-pointer text-nowrap"
                >
                  View All Service
                </Link>
              </div>
            </div>
          ))}
          <div className="flex w-full justify-center">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>
    </section>
  )
}
