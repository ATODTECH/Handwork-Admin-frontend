"use client"

import { contactHero } from "@/assets/site"
import { useOnload } from "@/hooks/use-onload"
import { DataLoading } from "@/components/site/data-loading"
import { PageHero } from "@/components/site/page-hero"
import { WidgetError } from "@/components/site/widget-error"
import { ContentContactIndex } from "./content"

const ContactIndex = () => {
  // sets the cookie the contact and subscribe endpoints expect
  const { isPending, isError, refetch, isRefetching } = useOnload()

  if (isPending) return <DataLoading className="my-50" />
  if (isError) {
    return (
      <div className="flex flex-col flex-1 h-screen justify-center items-center px-5">
        <section className="flex flex-col justify-self-center space-y-4 rounded-xl border border-[#E2E8F0] bg-primary-white p-6 w-full max-w-lg">
          <WidgetError message="Couldn't load the Contact us page." onRetry={() => refetch()} isRetrying={isRefetching} />
        </section>
      </div>
    )
  }

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
