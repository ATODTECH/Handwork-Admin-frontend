import Image, { type StaticImageData } from "next/image"
import { work1, work2, work3, work4 } from "@/assets/site"

const steps = [
  {
    title: "Search for a service",
    description: "Browse through various artisans categories",
    image: work1,
  },
  {
    title: "Choose a skilled professional",
    description: "View artisan profile, reviews and ratings",
    image: work2,
  },
  {
    title: "Book and pay securely",
    description: "Schedule your services with confidence",
    image: work3,
  },
  {
    title: "Get the job done",
    description: "Sit back while the expert handles the work",
    image: work4,
  },
]

const StepCard = ({ image, title, description }: { image: StaticImageData, title: string, description: string }) => (
  <div className="flex flex-col h-full p-3 border-[.5px] border-secondary-blue/10 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="relative md:w-full aspect-square mb-6 overflow-hidden rounded-xl">
      <Image src={image} alt={title} className="object-cover w-full h-full" />
    </div>
    <div className="flex flex-col grow text-base text-primary-text">
      <h3 className="font-semibold mb-3 leading-tight">{title}</h3>
      <p>{description}</p>
    </div>
  </div>
)

export const HowItWorks = () => (
  <section className="w-full p-16 px-4 py-10 sm:px-16 xl:px-28 lg:mt-12">
    <div className="flex flex-col my-16.25 sm:my-16.25">
      <h3 className="font-semibold text-center text-2xl 425xl:text-3xl sm:text-4xl lg:text-[2.75rem] text-secondary-orange mb-6.25">How It Works</h3>
      <div className="flex justify-center py-6 sm:py-12 sm:px-4 max-w-360 mx-auto">
        <div className="grid grid-cols-1 w-[80%] 425xl:w-[60%] sm:w-full sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
      </div>
    </div>
  </section>
)
