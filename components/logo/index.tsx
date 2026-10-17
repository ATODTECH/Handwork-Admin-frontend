import { logo } from "@/assets"
import Image from "next/image"

const LogoIndex = () => {
  return (
    <div className="flex h-fit items-center select-none">
      <Image
        src={logo}
        alt="Logo HandworkExpert"
        height={40}
        priority
        aria-label="logo"
        draggable={false}
        className="w-auto text-xs "
      />
      <span className=" text-lg leading-[100%] tracking-tight text-black">HandworkExpert</span>
    </div>
  )
}

export default LogoIndex