"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { servicesWeOffer } from "@/assets/site"

const services = [
  {
    title: "Plumbing",
    description: "Leak repairs, pipe installations, tank replacement and more.",
    image: servicesWeOffer,
  },
  {
    title: "Carpentry",
    description: "Custom furniture, repairs, installations, and woodworking services.",
    image: servicesWeOffer,
  },
  {
    title: "Electrical",
    description: "Wiring, lighting installation, repairs, and safety inspections.",
    image: servicesWeOffer,
  },
]

export const ServicesWeOffer = () => {
  const [currentService, setCurrentService] = useState(0)
  const service = services[currentService]

  const handleNext = () => {
    setCurrentService((prev) => (prev === services.length - 1 ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setCurrentService((prev) => (prev === 0 ? services.length - 1 : prev - 1))
  }

  return (
    <section className="flex flex-col items-center w-full px-4 py-10 p-16 sm:px-16 xl:px-28 425xl:my-12 sm:mb-28.5 sm:mt-0">
      <div className="flex flex-col sm:flex-row justify-center items-center relative gap-15 w-[90%] sm:w-full mb-16 sm:mb-0">
        {/* main image */}
        <div className="hidden sm:flex w-60 425xl:w-75 sm:w-[45%] h-auto">
          <Image src={service.image} alt={service.title} className="w-full h-full" />
        </div>
        {/* content */}
        <div className="flex flex-col items-start order-1 sm:order-2 w-full sm:w-[45%]">
          <h3 className="font-semibold text-2xl 425xl:text-3xl sm:text-4xl lg:text-[2.75rem] text-secondary-orange mb-6 self-center sm:self-start">Services We Offer</h3>
          {/* centre image */}
          <div className="flex sm:hidden self-center w-60 425xl:w-75 h-auto mb-6">
            <Image src={service.image} alt={service.title} className="w-full h-full" />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <h4 className="font-medium text-lg 425xl:text-xl sm:text-2xl">{service.title}</h4>
            <p className="font-normal text-sm leading-6 425xl:text-xl sm:text-2xl 425xl:leading-relaxed">{service.description}</p>
          </div>
          {/* Navigation buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              aria-label="Previous service"
              className="flex items-center justify-center bg-secondary-blue rounded-[5px] text-primary-white h-8 w-8 sm:h-11 sm:w-11 outline-0 cursor-pointer"
              onClick={handlePrev}>
              <ArrowLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next service"
              className="flex items-center justify-center bg-primary-white rounded-[5px] text-secondary-blue border border-secondary-blue h-8 w-8 sm:h-11 sm:w-11 outline-0 cursor-pointer"
              onClick={handleNext}>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
