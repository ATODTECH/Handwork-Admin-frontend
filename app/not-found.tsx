import Image from "next/image"
import Link from "next/link"
import { notFoundIcon, siteLogo } from "@/assets/site"
import { GoBackButton } from "@/components/site/go-back-button"

const NotFound = () => {
  return (
    <div className="font-site bg-[#FAFAFA] h-screen w-full overflow-y-auto">
      <header className="fixed top-0 backdrop-blur-[6px] w-screen max-w-[1920px] py-3 px-4 sm:px-16 xl:px-28 z-20 shadow-md bg-primary-white">
        <nav className="flex flex-row w-full items-center justify-between">
          <Link href="/" className="outline-0">
            <Image src={siteLogo} draggable={false} className="h-10 w-auto" alt="Logo" />
          </Link>
          <div className="w-[21%] py-6"></div>
        </nav>
      </header>
      <div className="flex flex-col justify-center items-center flex-1 h-full text-[#101828] relative px-4 pt-20 sm:px-16 xl:px-28">
        <div className="flex flex-col justify-center items-center text-center gap-4 mb-2">
          <div className="h-auto w-15 425xl:w-18 sm:w-20 mb-4">
            <Image src={notFoundIcon} alt="404" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-bold text-[1.75rem] leading-7 425xl:text-[2rem] sm:text-[2.75rem] 425xl:leading-[100%]">We can’t find that page</h1>
          <p className="text-sm 425xl:text-[1rem] text-[#475467]">Sorry, the page you are looking for doesn&apos;t exist or has been moved.</p>
          <div className="flex items-center gap-4">
            <GoBackButton />
            <Link
              href="/"
              className="bg-secondary-blue text-primary-white rounded-sm font-semibold text-xs 425xl:text-sm py-3 px-4 outline-0 ring-0 cursor-pointer border border-secondary-blue"
            >
              Take me home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
