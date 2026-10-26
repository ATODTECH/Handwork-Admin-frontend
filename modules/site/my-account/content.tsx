import { ChevronRight } from "@/assets"

const AccountContent = () => {
  return (
    <section className="relative flex flex-col w-full 425xl:max-w-[60%] py-10 px-4 sm:px-16 xl:px-28 425xl:py-20 md:py-30 lg:pt-40 lg:pb-21 gap-8.75">
      <div className="flex flex-nowrap gap-2 items-center text-base text-hw-grey-700">
        <span className="">Home</span>
        <ChevronRight size={16} />
        <span className=" text-hw-grey-text-900 font-semibold">My Accounts</span>
      </div>
      <aside className="flex flex-1 gap-10">
        <nav className=" w-49.5 overflow-y-auto pt-8 px-4 bg-[#EFF5FF]">

        </nav>
        <div className=" flex-1"></div>
      </aside>
    </section>
  )
}

export default AccountContent