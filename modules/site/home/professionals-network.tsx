import Image from "next/image"
import { engineer } from "@/assets/site"
import { StoreBadges } from "@/components/site/store-badges"

export const ProfessionalsNetworkSection = () => (
  <section className="flex flex-col relative items-center justify-center w-full px-4 py-10 p-16 sm:px-16 xl:px-28 425xl:mb-12 sm:mb-28.5">
    <div className="flex justify-center w-full lg:max-w-[90%] text-primary-text mb-16 sm:mb-0">
      {/* content */}
      <div className="flex flex-col items-center justify-end">
        <div className="flex flex-col justify-end max-w-[90%] md:max-w-[80%]">
          <h2 className="font-semibold text-2xl 425xl:text-3xl sm:text-4xl lg:text-[2.125rem] sm:leading-11 text-primary-text text-center md:text-start mb-8">Join the network of professionals around you</h2>
          <h5 className="text-base 425xl:text-xl sm:text-2xl text-primary-text mb-4">
            Become part the working class community and find your next client and extra income.
          </h5>
          <StoreBadges className="mt-8" />
        </div>
      </div>
      {/* image */}
      <div className="hidden md:flex h-auto w-140">
        <Image src={engineer} alt="Professional worker with safety equipment" className="w-full h-full object-cover" />
      </div>
    </div>
  </section>
)
