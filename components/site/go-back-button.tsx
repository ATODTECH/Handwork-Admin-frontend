"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export const GoBackButton = () => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      type="button"
      className="flex gap-2 items-center bg-primary-white text-secondary-orange rounded-sm font-semibold text-xs 425xl:text-sm py-3 px-4 outline-0 ring-0 cursor-pointer border border-[#F99E78] shadow-[0px_1px_2px_#1018280D]"
    >
      <ArrowLeft size={18} />
      Go back
    </button>
  )
}
