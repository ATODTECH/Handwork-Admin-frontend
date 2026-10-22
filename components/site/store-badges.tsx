"use client"

import Image from "next/image"
import { appStore, googlePlay } from "@/assets/site"

/** App Store / Google Play badges; the apps aren't published yet */
export const StoreBadges = ({ className = "" }: { className?: string }) => (
  <div role="link" className={`flex items-center gap-2 rounded-sm w-fit font-semibold ${className}`}>
    <Image src={appStore} draggable={false} alt="apple store" className="h-8 lg:h-11 w-auto cursor-pointer" onClick={() => alert("Coming soon!")} />
    <Image src={googlePlay} draggable={false} alt="Google play" className="h-8 lg:h-11 w-auto cursor-pointer" onClick={() => alert("Coming soon!")} />
  </div>
)
