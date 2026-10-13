import { formatCount, formatGrowthRate, formatNaira } from "@/lib/format";
import { cn } from "cn";
import { ArrowDownRight, ArrowUpRight, Book, ShieldCheck, TrendingDown, TrendingUp, User2, Users2 } from "@/assets";
import { LucideIcon } from "lucide-react";
import { useState } from "react"

// Dummy Data [current, previous]
const API_DATA: gridCardProps = {
  revenue: [84784, 84781],
  users: [21864, 11864],
  artisans: [13854, 13864],
  booking: [13864, 13864],
  pending: [340, 340],
}

interface StatCardProps {
  title: string;
  data: string;
  icon?: {icon: LucideIcon};
  scale?: string[];
  growthRate?: string[];
  color: string;
  className: string;
}

const StatCard = ({
  title,
  data,
  icon,
  growthRate,
  color,
  className,
}: StatCardProps) => {
  return (
    <div className={cn("flex flex-col justify-between gap-5 rounded-[15px] px-3.5 2xl:px-4 py-6.5 h-full cursor-default", className)}>
      <div className="flex items-start gap-4">
        {icon && (
          <span className="inline-flex shrink-0 p-2 bg-[#EFF5FF] rounded-full text-hw-secondary">
            <icon.icon strokeWidth={1.5} size={24} className="shrink-0" />
          </span>
        )}
        <div className="flex flex-col gap-2.5">
          <span className={cn(" text-xs font-normal", color)}>{title}</span>
          <span className=" text-2xl font-semibold">{data}</span>
        </div>
      </div>

      {growthRate && (
        (title==="Total Revenue") ?
        <div className={`flex items-center justify-center px-6.75 py-2.25 rounded-md bg-hw-base-white w-fit`}>
          {(growthRate[1]==="up") ?
            <ArrowUpRight strokeWidth={2} className="shrink-0 text-hw-secondary" />:
            <ArrowDownRight strokeWidth={2} className="shrink-0 text-destructive" />
          }
        </div> :
        <div className="flex flex-nowrap text-[#606060] text-[.625rem] font-normal">
          {(growthRate[1]==="up") ?
            <TrendingUp size={14} strokeWidth={2} className="text-[#00B69B] shrink-0" /> :
            <TrendingDown size={14} strokeWidth={2} className="text-destructive shrink-0" />
          }
          &nbsp;<span className={` ${(growthRate[1]==="up")? 'text-[#00B69B]': 'text-destructive'}`}>{growthRate[0]}%</span>&nbsp;{growthRate[1]} from yesterday
        </div>
        
      )}
    </div>
  )    
}

const GridCard = () => {
  const [data, setData] = useState(API_DATA)

  return (
    <>
      <StatCard
        title="Total Revenue"
        data={formatNaira(Object.values(data)[0][0])}
        color="text-[#FFFFFFDB]"
        growthRate={formatGrowthRate(Object.values(data)[0][0], Object.values(data)[0][1])}
        className="bg-hw-secondary text-hw-base-white"
      />
      <StatCard
        title="Total Users"
        data={formatCount(Object.values(data)[1][0])}
        icon={{icon:Users2}}
        color="text-[#9E9E9E]"
        growthRate={formatGrowthRate(Object.values(data)[1][0], Object.values(data)[1][1])}
        className="bg-hw-base-white text-hw-grey-text-900 border-[.5px] border-hw-grid-border"
        />
      <StatCard
        title="Total Artisans"
        data={formatCount(Object.values(data)[2][0])}
        icon={{icon:User2}}
        color="text-[#9E9E9E]"
        growthRate={formatGrowthRate(Object.values(data)[2][0], Object.values(data)[2][1])}
        className="bg-hw-base-white text-hw-grey-text-900 border-[.5px] border-hw-grid-border"
        />
      <StatCard
        title="Total Booking"
        data={formatCount(Object.values(data)[3][0])}
        icon={{icon:Book}}
        color="text-[#9E9E9E]"
        growthRate={formatGrowthRate(Object.values(data)[3][0], Object.values(data)[3][1])}
        className="bg-hw-base-white text-hw-grey-text-900 border-[.5px] border-hw-grid-border"
        />
      <StatCard
        title="Pending"
        data={formatCount(Object.values(data)[4][0])}
        icon={{icon:ShieldCheck}}
        color="text-[#9E9E9E]"
        growthRate={formatGrowthRate(Object.values(data)[4][0], Object.values(data)[4][1])}
        className="bg-hw-base-white text-hw-grey-text-900 border-[.5px] border-hw-grid-border"
      />
    </>
  )
}

export default GridCard