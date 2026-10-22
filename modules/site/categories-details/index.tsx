"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, MapPin, PhoneCall, Star } from "lucide-react"
import { JoinNetwork } from "@/components/site/join-network"
import { Pagination } from "@/components/site/pagination"
import type { CategoryDetails } from "./data"

// Base prices are stored in NGN (the source of truth). Everything else is derived.
const CURRENCIES = [
  { code: "NGN", symbol: "₦", rate: 1 },
  { code: "USD", symbol: "$", rate: 1 / 1600 },
  { code: "GBP", symbol: "£", rate: 1 / 2050 },
  { code: "EUR", symbol: "€", rate: 1 / 1750 },
  { code: "GHS", symbol: "₵", rate: 1 / 105 },
]

type Currency = typeof CURRENCIES[number]

const PAGE_SIZE = 9

function formatPrice(priceNGN: string, currency: Currency) {
  const converted = Number(priceNGN) * currency.rate
  // Whole naira has no decimals; converted foreign currencies keep up to 2.
  const decimals = currency.code === "NGN" ? 0 : converted < 100 ? 2 : 0
  return `${currency.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/** Currency and sub-category filters are shown but disabled until listings come from the API */
const DisabledFilter = ({ label }: { label: string }) => (
  <button
    disabled
    className="flex items-center gap-1.5 bg-[#B6B6B6] rounded-lg px-3 py-2 text-sm font-medium text-primary-white cursor-not-allowed"
  >
    <span>{label}</span>
    <ChevronDown size={14} />
  </button>
)

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-secondary-orange text-orange-400" : "text-slate-200"}
        />
      ))}
    </div>
  )
}

export const CategoryDetailsIndex = ({ id, details }: { id: string, details: CategoryDetails }) => {
  const { category, categoryList } = details
  const [currency] = useState<Currency>(CURRENCIES[0])
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(categoryList.length / PAGE_SIZE)
  const start = (page - 1) * PAGE_SIZE
  const visible = categoryList.slice(start, start + PAGE_SIZE)

  return (
    <section className="w-full flex flex-col items-center relative">
      <div className="flex flex-col w-full items-center">
        <div className="flex items-center justify-between w-[90%] md:w-full pt-36 px-4 p-16 sm:px-16 xl:px-28 gap-4">
          <h1 className="font-semibold leading-relaxed text-start text-xl 425xl:text-2xl sm:text-4xl lg:leading-14 tracking-[2%]">{category}</h1>
          <span className="flex flex-nowrap text-base font-medium text-[#858585] select-none">{id} / categories </span>
        </div>

        <div className="w-full flex flex-col items-center relative px-4 p-16 sm:px-16 xl:px-28 bg-[#F9F7F7]">
          <div className="flex w-[95%] 425xl:w-full 1280xl:w-[95%] items-center justify-end gap-3 mb-6">
            <DisabledFilter label={currency.symbol} />
            <DisabledFilter label="Sub Category" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 w-[95%] 425xl:w-full 1280xl:w-[95%]">
            {visible.map((card, index) => (
              <div key={start + index} className="flex flex-col rounded-xl bg-white overflow-hidden">
                <div className="relative w-auto h-40">
                  <Image
                    src={card.backdropImage}
                    alt={card.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top text-sm font-semibold italic"
                  />
                  {/* Avatar + price pill + negotiable */}
                  <div className="absolute w-full px-3 bottom-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image
                        src={card.avatar}
                        alt=""
                        className="w-8 h-8 shrink-0 rounded-full object-cover border"
                      />
                      <span className="text-sm font-semibold text-primary-white whitespace-nowrap backdrop-blur-xl backdrop-brightness-90 rounded-md">
                        {formatPrice(card.amount, currency)}
                      </span>
                    </div>
                    {card.negotiable && (
                      <span className="bg-secondary-orange text-white text-xs font-medium px-3 py-1.5 rounded-lg select-none">
                        Negotiable
                      </span>
                    )}
                  </div>
                </div>
                <div className="pt-6 pb-4 px-4">
                  <h3 className="text-sm font-medium text-slate-800 leading-snug mb-2 line-clamp-2">
                    {card.title}
                  </h3>

                  <StarRating rating={card.ratings} />

                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div className="rounded-full border border-dashed p-2">
                        <PhoneCall size={13} />
                      </div>
                      <span>{card.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>{card.location}</span>
                      <div className="rounded-full border border-dashed p-2">
                        <MapPin size={13} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-full justify-center pt-16">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>

        <JoinNetwork className="my-16 pt-36 px-4 p-16 sm:px-16 xl:px-28" />
      </div>
    </section>
  )
}
