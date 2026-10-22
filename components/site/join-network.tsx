import Image from "next/image"
import { engineer } from "@/assets/site"
import { StoreBadges } from "./store-badges"

/** "Join the network" call to action closing out the inner pages */
export const JoinNetwork = ({ className = "my-16 pt-0 lg:pt-16" }: { className?: string }) => (
  <div className={`flex justify-center w-full max-w-[90%] text-primary-text ${className}`}>
    <div className="flex flex-col justify-end 425xl:max-w-[80%]">
      <h4 className="font-semibold self-center text-center sm:text-start sm:self-start text-xl 425xl:text-2xl sm:text-3xl lg:text-[2rem] lg:leading-10 425xl:max-w-[80%] mb-4">Join the network of professionals around you</h4>
      <p className="sm:max-w-[90%] font-medium text-sm tracking-tight leading-6 mb-7">
        Become part the working class community and find your next client and extra income.
      </p>
      <StoreBadges />
    </div>
    <div className="hidden sm:flex h-auto w-140">
      <Image src={engineer} alt="engineer" className="w-full h-full object-cover" />
    </div>
  </div>
)
