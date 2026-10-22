"use client"

import Image, { type StaticImageData } from "next/image"
import { motion } from "framer-motion"

interface PageHeroProps {
  image: StaticImageData
  imageAlt?: string
  imageClassName?: string
  className?: string
  children: React.ReactNode
}

/** Full-height dark banner with a fading photo behind the page heading */
export const PageHero = ({
  image,
  imageAlt = "",
  imageClassName = "object-[55%_30%]",
  className = "justify-center",
  children,
}: PageHeroProps) => (
  <section className={`min-h-screen w-full flex items-center isolate relative px-4 p-16 sm:px-16 xl:px-28 bg-[#151327] ${className}`}>
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          draggable={false}
          className={`select-none pointer-events-none object-cover opacity-70 ${imageClassName}`}
        />
      </motion.div>
    </div>
    {children}
  </section>
)
