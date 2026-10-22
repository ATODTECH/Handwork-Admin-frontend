import Image from "next/image"
import { backgroundCheck, creditCard, customerSupport } from "@/assets/site"

const factors = [
  {
    icon: backgroundCheck,
    title: "Background Checked",
    description: "Every professional is verified for skills and trustworthiness.",
  },
  {
    icon: creditCard,
    title: "Secure Transactions",
    description: "Payments are safe, and  completion is guaranteed.",
  },
  {
    icon: customerSupport,
    title: "Customer Support",
    description: "Dedicated help whenever you need it.",
    className: "sm:col-span-2 sm:mx-auto lg:col-span-1 lg:mx-0",
  },
]

export const TrustFactorsSection = () => (
  <section className="flex flex-col items-center w-full px-4 py-10 p-16 sm:px-16 xl:px-28 425xl:mb-12 sm:mb-28.5">
    <div className="flex flex-col justify-center items-center relative 425xl:gap-15 w-[90%] sm:w-full mb-16 sm:mb-0">
      <h3 className="font-semibold text-2xl 425xl:text-3xl sm:text-4xl lg:text-[2.75rem] text-secondary-orange mb-6 text-center">Services Guaranteed And Trust Factors</h3>
      <div className="flex flex-col sm:grid items-center justify-center sm:grid-cols-2 lg:grid-cols-3 gap-6.25 lg:gap-11.25 w-[90%] 425xl:w-auto text-[1rem]">
        {factors.map((factor) => (
          <div key={factor.title} className={`flex flex-col justify-between items-center h-full max-h-120.5 w-full max-w-75 lg:max-w-130.75 bg-[#E8E9EE] py-8.5 425xl:py-12.5 px-5 text-primary-text rounded-[15px] ${factor.className ?? ""}`}>
            <div className="flex justify-center items-center mb-8 lg:mb-10.5 p-3 rounded-full bg-secondary-blue">
              <Image src={factor.icon} alt={factor.title} className="w-7 h-7" />
            </div>
            <div className="flex flex-col h-full text-center">
              <p className="font-semibold">{factor.title}</p>
              <p className="font-medium text-center">{factor.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
