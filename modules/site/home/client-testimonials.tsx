"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { clientTestimonial1, clientTestimonial2 } from "@/assets/site"

const testimonials = [
  {
    name: "Emmanuel Samuel",
    image: clientTestimonial1,
    quote:
      "I had a major plumbing emergency, and ProHandy saved the day, quick response, professional service, and fair pricing.",
  },
  {
    name: "Sarah Johnson",
    image: clientTestimonial2,
    quote:
      "The electrician was knowledgeable and fixed my wiring issue in no time. I'll definitely use ProHandy again!",
  },
]

const quoteMarkClass = "absolute font-serif text-[7rem] leading-none text-[#1a237e] select-none"

export const ClientTestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const testimonial = testimonials[currentTestimonial]

  const handleNext = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="flex relative justify-center overflow-hidden w-full px-4 py-10 p-16 sm:px-16 xl:px-28 425xl:mb-12 sm:mb-28.5">
      <div className="flex flex-col relative w-full max-w-[80%] sm:max-w-[90%] justify-center items-center 425xl:gap-15 mb-16 sm:mb-0">
        <h3 className="font-semibold text-2xl 425xl:text-3xl sm:text-4xl lg:text-[2.75rem] text-secondary-orange mb-6 text-center">What Clients Says</h3>
        <div className="flex flex-col md:flex-row relative w-full gap-17.5 md:gap-9.5 lg:gap-17.5">
          <div className="flex relative self-center md:self-start w-[80%] 425xl:w-[60%] h-fit">
            <Image src={testimonial.image} alt="client_testimonal" draggable={false} className="w-full h-full" />
            {/* the name is split across the photo edge */}
            <div className="absolute flex items-end justify-end font-semibold text-sm sm:text-base lg:text-xl w-[85%] h-full">
              <span className="text-primary-white flex absolute bottom-5">{testimonial.name.slice(0, 4)}</span>
            </div>
            <div className="absolute flex items-end justify-end font-semibold text-sm sm:text-base lg:text-xl w-[15%] right-0 h-full">
              <span className="text-primary-text flex absolute bottom-5 w-full truncate overflow-visible">{testimonial.name.slice(4)}</span>
            </div>
          </div>
          <div className="flex flex-col relative justify-between w-full gap-10">
            <div className="flex relative">
              <span className={`${quoteMarkClass} -top-10 -left-2.5`} aria-hidden>&ldquo;</span>
              <p className="text-primary-text font-normal text-base leading-6 425xl:text-xl 425xl:leading-normal sm:text-2xl pt-6.5 pb-3.25 px-5 425xl:py-4 425xl:px-9 sm:px-16.25">
                {testimonial.quote}
              </p>
              <span className={`${quoteMarkClass} -bottom-20 right-0`} aria-hidden>&rdquo;</span>
            </div>
            <div className="flex self-start md:self-end gap-4 z-10">
              <button
                className="flex items-center justify-center bg-secondary-blue rounded-[5px] text-primary-white h-8 w-8 sm:h-11 sm:w-11 outline-0 cursor-pointer"
                onClick={handlePrev} aria-label="Previous testimonial">
                <ArrowLeft size={20} />
              </button>
              <button
                className="flex items-center justify-center bg-primary-white rounded-[5px] text-secondary-blue border border-secondary-blue h-8 w-8 sm:h-11 sm:w-11 outline-0 cursor-pointer"
                onClick={handleNext} aria-label="Next testimonial">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
