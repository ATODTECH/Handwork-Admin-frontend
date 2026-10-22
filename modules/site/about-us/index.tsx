import Image from "next/image"
import { aboutHero, convenience, humanResources, painter, servicesProvider, servicesWeOffer, vision } from "@/assets/site"
import { PageHero } from "@/components/site/page-hero"
import { JoinNetwork } from "@/components/site/join-network"

const reasons = [
  { icon: servicesProvider, alt: "services", title: "Reliable Services", description: "Verified artisans with proven expertise." },
  { icon: humanResources, alt: "human resources", title: "Empowering Artisans", description: "We provide a platform for artisans to grow and succeed." },
  { icon: convenience, alt: "convenience", title: "Convenience", description: "Find and book skilled professionals in just a few clicks.", className: "sm:col-span-2 sm:mx-auto lg:col-span-1 lg:mx-0" },
]

const headingClass = "font-semibold text-center sm:text-start text-2xl 425xl:text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-14 text-secondary-orange mb-6.25"
const bodyClass = "text-primary-text font-normal tracking-[2%] text-sm leading-6 425xl:text-[1rem] 425xl:leading-7 mb-5"
const quote = "“every task finds its expert touch”"
const quoteClass = "absolute left-1/2 -translate-x-1/2 -bottom-7 text-[.75rem] font-semibold tracking-[2%] text-black bg-primary-white rounded-[10px] py-5 px-4 shadow-[0px_4px_25px_#0000000D] text-nowrap"

const AboutUsIndex = () => (
  <>
    <PageHero image={aboutHero} imageAlt="Professional tradesperson at work">
      <div className="relative flex flex-col items-center w-full max-w-[80%] py-10 425xl:py-20 md:py-30 lg:pt-40 lg:pb-21 gap-8.75">
        <h1 className="text-4xl 425xl:text-5xl sm:text-6xl lg:text-[4rem] font-bold leading-tight text-primary-white"><span className="text-secondary-orange">About</span>&nbsp;Us</h1>
        <h2 className="w-full font-medium text-center flex flex-col lg:max-w-[60%] text-xl lg:text-2xl text-primary-white">
          Connecting You with Trusted Artisans for Every Handiwork Need.
        </h2>
      </div>
    </PageHero>

    <section className="w-full flex flex-col items-center relative px-4 p-16 sm:px-16 xl:px-28">
      <div className="flex flex-col w-full lg:max-w-[90%] items-center bg-primary-white">
        {/* Who we are */}
        <div className="flex flex-col sm:flex-row gap-10 lg:gap-20 items-center justify-center w-full my-16">
          <div className="flex flex-col flex-1 max-w-[90%] sm:min-w-[50%] sm:max-w-[60%]">
            <h3 className={headingClass}>Who We Are</h3>
            <div className="flex self-center sm:hidden overflow-hidden h-auto w-60 425xl:w-80 lg:w-120 mb-6.25">
              <Image src={servicesWeOffer} alt="Carpenter" className="h-full w-full object-cover" />
            </div>
            <p className={bodyClass}>
              At HandworkExpert, we bridge the gap between people and skilled artisans, offering a platform that delivers quality handiwork services with ease and professionalism. Whether it’s plumbing, painting, electrical repairs, or carpentry, we ensure that every task is handled by trusted experts who take pride in their craft.
            </p>
          </div>
          <div className="hidden sm:flex overflow-hidden h-auto w-120">
            <Image src={servicesWeOffer} alt="Carpenter" className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Our mission */}
        <div className="flex gap-10 lg:gap-20 items-center justify-center w-full my-16">
          <div className="hidden sm:flex relative h-auto w-120">
            <Image src={painter} alt="painter" className="h-full w-full object-cover rounded-[20px]" />
            <span className={`hidden md:flex ${quoteClass}`}>{quote}</span>
          </div>
          <div className="flex flex-col flex-1 max-w-[90%] sm:min-w-[50%] sm:max-w-[60%]">
            <h3 className={headingClass}>Our Mission</h3>
            <div className="flex relative self-center sm:hidden h-auto w-60 425xl:w-80 lg:w-120 mb-8.25">
              <Image src={painter} alt="painter" className="h-full w-full object-cover rounded-[20px]" />
              <span className={quoteClass}>{quote}</span>
            </div>
            <p className={bodyClass}>
              Our mission is simple, to create seamless access to reliable artisans while empowering professionals to showcase their skills. We aim to build a community where trust, excellence, and convenience come together to transform how people find and deliver services.
            </p>
          </div>
        </div>

        {/* Why choose us */}
        <div className="flex flex-col gap-8 items-center justify-center w-full my-16">
          <div className="flex flex-col items-center text-center">
            <h3 className="font-semibold text-2xl 425xl:text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-14 text-secondary-orange mb-6.25">Why Choose Us</h3>
            <p className="w-full max-w-[90%] lg:max-w-[60%] text-center text-primary-text font-normal tracking-[2%] text-sm leading-5 425xl:text-[1rem] 425xl:leading-6 mb-5">
              At HandworkExpert, we make finding skilled artisans easy and reliable. With verified professionals, quality service, and a seamless booking process, we’re here to ensure every job is done right, the first time.
            </p>
          </div>
          <div className="flex flex-col sm:grid items-center justify-center sm:grid-cols-2 lg:grid-cols-3 gap-6.25 lg:gap-11.25 w-[80%] 425xl:w-auto text-[1rem]">
            {reasons.map((reason) => (
              <div key={reason.title} className={`flex flex-col justify-between items-center h-full max-h-120.5 w-full max-w-75 lg:max-w-130.75 py-8.5 425xl:py-12.5 px-5 text-primary-text rounded-[15px] ${reason.className ?? ""}`}>
                <div className="mb-8 lg:mb-10.5 p-4 rounded-full bg-secondary-blue h-auto w-18">
                  <Image src={reason.icon} alt={reason.alt} className="w-full h-full" />
                </div>
                <div className="flex flex-col h-full text-center">
                  <p className="font-bold tracking-[2%]">{reason.title}</p>
                  <p className="font-medium text-sm text-center tracking-[2%]">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our vision */}
        <div className="flex gap-10 lg:gap-20 items-center justify-center w-full my-16">
          <div className="flex flex-col flex-1 max-w-[90%] sm:min-w-[50%] sm:max-w-[60%]">
            <h3 className={headingClass}>Our Vision</h3>
            <div className="flex sm:hidden self-center overflow-hidden h-auto w-60 425xl:w-80 lg:w-120 mb-6.25">
              <Image src={vision} alt="vision" className="h-full w-full object-cover" />
            </div>
            <p className={bodyClass}>
              We envision a world where finding skilled artisans is no longer a challenge. By fostering connections based on trust and quality, HandworkExpert strives to become the go-to platform for handiwork services, revolutionizing how people connect with professionals.
            </p>
          </div>
          <div className="hidden sm:flex overflow-hidden h-auto w-120">
            <Image src={vision} alt="vision" className="h-full w-full object-cover" />
          </div>
        </div>

        <JoinNetwork />
      </div>
    </section>
  </>
)

export default AboutUsIndex
