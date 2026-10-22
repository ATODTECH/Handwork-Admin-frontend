import { faqHero } from "@/assets/site"
import { PageHero } from "@/components/site/page-hero"
import ContentFAQIndex from "./content"

const FAQIndex = () => (
  <>
    <PageHero image={faqHero} imageClassName="object-top">
      <div className="relative flex flex-col items-center text-center w-full 425xl:max-w-[60%] py-10 425xl:py-20 md:py-30 lg:pt-40 lg:pb-21 gap-8.75">
        <h1 className="text-4xl 425xl:text-5xl sm:text-6xl lg:text-[4rem] font-bold leading-tight text-primary-white"><span className="text-secondary-orange">HandworkExpert</span> Frequently Asked Questions</h1>
        <h2 className="w-full font-medium text-center flex flex-col lg:max-w-[80%] text-xl lg:text-2xl text-primary-white">
          Everything you need to know about our services
        </h2>
      </div>
    </PageHero>
    <ContentFAQIndex />
  </>
)

export default FAQIndex
