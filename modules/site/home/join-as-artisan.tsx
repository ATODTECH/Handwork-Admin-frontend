import Image from "next/image"
import { joinAsArtisan } from "@/assets/site"
import { StoreBadges } from "@/components/site/store-badges"

export const JoinAsArtisan = () => (
  <section className="flex flex-col items-center w-full px-4 py-10 p-16 sm:px-16 xl:px-28 425xl:mb-12 sm:mb-28.5">
    <div className="flex flex-col sm:flex-row justify-center items-center relative gap-15 w-[90%] sm:w-full mb-16 sm:mb-0">
      {/* content */}
      <div className="flex flex-col w-full sm:max-w-[45%]">
        <h3 className="font-semibold text-2xl 425xl:text-3xl sm:text-4xl lg:text-[2.75rem] text-secondary-orange mb-6 text-center sm:text-start">Join As an Artisan</h3>
        {/* centre image */}
        <div className="flex sm:hidden self-center w-60 425xl:w-75 sm:w-[45%] h-auto mb-6">
          <Image src={joinAsArtisan} alt="Skilled professionals working as artisans" className="w-full h-full" />
        </div>
        <p className="flex flex-col font-normal text-sm leading-6 425xl:leading-relaxed 425xl:text-xl sm:text-2xl text-primary-text mb-4">
          Are you a skilled professional looking for more job opportunities? Join ProHandy today and connect with customers in need of your expertise.
        </p>
        <StoreBadges className="mt-8" />
      </div>
      {/* main image */}
      <div className="hidden sm:flex w-60 425xl:w-75 sm:w-[45%] h-auto">
        <Image src={joinAsArtisan} alt="Skilled professionals working as artisans" className="w-full h-full" />
      </div>
    </div>
  </section>
)
