"use client"

import { contactHero } from "@/assets/site"
import { PageHero } from "@/components/site/page-hero"
import { ContentContactIndex } from "./content"

/** The contact page shows straight away; the form talks to the API only when it's sent */
const ContactIndex = () => {
  return (
    <>
      <PageHero image={contactHero}>
        <div className="relative flex flex-col items-center w-full max-w-[80%] py-10 425xl:py-20 md:py-30 lg:pt-40 lg:pb-21 gap-8.75">
          <h1 className="text-4xl 425xl:text-5xl sm:text-6xl lg:text-[4rem] font-bold leading-tight text-primary-white"><span className="text-secondary-orange">Contact</span>&nbsp;Us</h1>
          <h2 className="w-full font-medium text-center flex flex-col lg:max-w-[80%] text-xl lg:text-2xl text-primary-white">
            We’re here to help. Reach out to us for inquiries, support, or feedback.
          </h2>
        </div>
      </PageHero>
      <ContentContactIndex />
    </>
  )
}

export default ContactIndex
