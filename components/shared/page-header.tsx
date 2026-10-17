import Link from "next/link"

interface DetailHeaderProps {
  title: string
  description?: string
  action: React.ReactNode
}

export const PageHeader = ({
  title,
  description,
  action,
}: DetailHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-5 w-full font-medium mb-6">
      <div className="flex flex-col">
        <h5 className="text-xs font-light text-[#626773]">Admin / Dashboard</h5>
        <h1 className=" text-xl 2xl:text-[22px] text-hw-grey-text-900">{title}</h1>
        {description && 
          <h2 className="">{description}</h2>
        }
      </div>
      {action}
    </div>
  )
}
