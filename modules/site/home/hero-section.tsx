"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { hero1, hero2, hero3, hero4, hero5 } from "@/assets/site"
import { StoreBadges } from "@/components/site/store-badges"

const heroImages = [
  {
    main: hero1,
    secondary: hero2,
    title: "Plumber",
    description:
      "From home repairs to expert craftsmanship, find verified artisans ready to deliver quality services quickly, efficiently, and at your convenience.",
  },
  {
    main: hero2,
    secondary: hero3,
    title: "Electrician",
    description:
      "Professional electricians to handle all your electrical needs, from installation to repair, ensuring safety and efficiency in your home.",
  },
  {
    main: hero3,
    secondary: hero4,
    title: "Carpenter",
    description:
      "Skilled carpenters ready to transform your space with custom woodwork, furniture repair, and installation services.",
  },
  {
    main: hero4,
    secondary: hero5,
    title: "Painter",
    description:
      "Expert painters who deliver flawless finishes for your interior and exterior spaces, bringing your vision to life with precision.",
  },
  {
    main: hero5,
    secondary: hero1,
    title: "Gardener",
    description:
      "Professional gardeners to maintain and beautify your outdoor spaces, from lawn care to landscaping and garden design.",
  },
]

const ROTATE_MS = 5000

// Floating photo cards on the right of the hero
const CarouselImage = ({ index, isMain = true }: { index: number, isMain?: boolean }) => {
  const image = heroImages[index]

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          stiffness: isMain ? 300 : 250,
          damping: 25,
          delay: isMain ? 0 : 0.1,
        },
      }}
      exit={{
        opacity: 0,
        x: -100,
        transition: {
          type: "spring",
          stiffness: isMain ? 300 : 250,
          damping: 25,
          duration: 0.5,
        },
      }}
      style={{
        position: "absolute",
        right: isMain ? "30%" : "0%",
        bottom: "18%",
        width: isMain ? "250px" : "210px",
        height: isMain ? "270px" : "220px",
        border: isMain ? "5px solid #FFF" : "",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        zIndex: isMain ? 2 : 1,
      }}
    >
      <Image
        src={isMain ? image.main : image.secondary}
        alt={isMain ? `${image.title} professional` : "Secondary professional"}
        fill
        sizes="250px"
        className="pointer-events-none object-cover"
      />
    </motion.div>
  )
}

const headlineWord: Variants = {
  hidden: { y: 28, opacity: 0 },
  show: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: 0.15 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
}

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRotation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, ROTATE_MS)
  }

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    startRotation()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Jump to a slide and restart the timer from there
  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    startRotation()
  }

  const current = heroImages[currentIndex]

  return (
    <section id="home" className="min-h-screen w-full flex items-center justify-center isolate relative px-4 p-16 sm:px-16 xl:px-28 bg-[#151327]">
      {/* Background photo */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={current.main}
              alt={`Professional ${current.title} at work`}
              fill
              priority={currentIndex === 0}
              sizes="100vw"
              draggable={false}
              className="cursor-grab select-none opacity-70 object-cover object-[55%_30%]"
            />
          </motion.div>
        </AnimatePresence>
        {/* Gradient scrim: dark at the bottom for text legibility, fading toward the photo */}
        <div className="absolute inset-0 bg-linear-to-t from-[#151327]/90 via-transparent to-[#151327]/0" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex w-full">
        <div className="grid w-full items-center gap-10 1280xl:grid-cols-[minmax(0,620px)_1fr]">
          {/* Text column */}
          <div className="max-w-2xl py-10 425xl:py-20 md:py-30 lg:py-40">
            <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] font-bold leading-tight text-primary-white">
              {["Connecting You", "With Professional"].map((line, i) => (
                <motion.span
                  key={line}
                  custom={i}
                  variants={headlineWord}
                  initial="hidden"
                  animate="show"
                  className="block"
                >
                  {line}
                </motion.span>
              ))}
              <motion.span
                custom={2}
                variants={headlineWord}
                initial="hidden"
                animate="show"
                className="mt-1 block"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current.title}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.35 }}
                    className="inline-block text-secondary-orange"
                  >
                    {current.title}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            </h1>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-136 h-28 425xl:h-full font-medium text-base text-primary-white/85"
            >
              {current.description}
            </motion.h2>

            <StoreBadges className="mt-8 py-3 shadow-xl shadow-black/20" />
          </div>

          {/* Image column: floating photo cards, only visible on larger screens */}
          <div className="flex gap-10 flex-col-reverse w-full h-full relative overflow-visible">
            <div className="hidden lg:block">
              <AnimatePresence mode="popLayout">
                <CarouselImage key={`main-${currentIndex}`} index={currentIndex} isMain />
                <CarouselImage key={`secondary-${currentIndex}`} index={currentIndex} isMain={false} />
              </AnimatePresence>
            </div>

            {/* Navigation dots */}
            <div className="flex relative gap-2">
              {heroImages.map((image, index) => (
                <button
                  key={image.title}
                  aria-label={`Show ${image.title}`}
                  className={`h-2.5 w-2.5 rounded-full cursor-pointer ${index === currentIndex ? "bg-secondary-orange" : "bg-gray-400"}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
