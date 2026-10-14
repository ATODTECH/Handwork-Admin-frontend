import { useState } from "react"
import { Headphones, Shield } from "@/assets";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import InitialsTemp from "@/components/shared/initials";
import { cn } from "cn";
import { TONE_STYLES } from "@/lib/tones";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { LucideIcon } from "lucide-react";
import { formatActivityDate, formatActivityDay } from "@/lib/format";

const CLASSNAME="rounded-[10px] border border-hw-grey-200 pt-3.5 divide-y divide-hw-grey-200"

// Dummy Data
const ARTISAN: ARTISANProps[] = [
  {id:1, name:"Kayode Amusa", location:"Lagos", role:"Carpenter", createdAt:"2026-10-14T14:00:00Z"},
  {id:2, name:"Fatima Okonkwo", location:"Abuja", role:"Fashion Designer", createdAt:"2026-10-12T14:00:00Z"},
  {id:3, name:"Blessing Ibe", location:"Kaduna", role:"Hairstylist", createdAt:"2026-10-14T14:00:00Z"},
  {id:4, name:"Emeka Nwosu", location:"Port Harcourt", role:"Electrician", createdAt:"2026-10-11T14:00:00Z"},
  {id:5, name:"Hamisu Anas", location:"Sokoto", role:"Electrician", createdAt:"2026-10-10T14:00:00Z"},
]
const DISPUTES: DISPUTESProps[] = [
  {code:"AD2026", customer:"Yekeen Habib", artisan:"Samuel", role:"Carpenter", dispute:"Payment Dispute", solution:"Pending", timeStamp:"2026-10-14T14:00:00Z"},
  {code:"AD2026", customer:"Ann Mary", artisan:"Festus", role:"Plumber", dispute:"Artisan Misconduct", solution:"In Review", timeStamp:"2026-10-13T14:00:00Z"},
  {code:"AD2026", customer:"Rebecca Julius", artisan:"Anas", role:"Electrician", dispute:"Artisan Misconduct", solution:"Pending", timeStamp:"2026-10-12T14:00:00Z"},
]

interface GridHeadProps {
  titles: string[];
  icon: {icon:LucideIcon};
  dataLength: number;
  route: string;
  className: string;
}
const GridRowHead = ({
  titles,
  icon,
  dataLength,
  route,
  className,
}: GridHeadProps) => {
  return (
    <div className="flex items-center px-5 pb-4 gap-4 justify-between">
      <div className="flex gap-2">
        <div className={cn("p-1.5 rounded-md h-fit", className)}>
          <icon.icon strokeWidth={2} size={16} className="shrink-0" />
        </div>
        <div className="flex flex-col">
          <h4 className=" text-sm font-semibold text-hw-grey-text-900">{titles[0]}</h4>
          <span className=" text-[11px] font-normal text-[#6D7280]">{dataLength ?? 0}&nbsp;{titles[1]}</span>
        </div>
      </div>
      <Link href={route}>
        <Button 
          variant={"secondary"} 
          disabled={dataLength>0?false:true} 
          className={cn("text-xs font-medium cursor-pointer", className)}
        >
          View All
        </Button>
      </Link>
    </div>
  )
}

const GridRowCard = ({
  initials,
  details,
  tone,
  action,
  date,
  onClick,
}: GridRowCardProps) => {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3">
      <div className="flex items-start gap-2.5">
        {initials ?? ""}
        <div className="flex flex-col gap-0.5">
          <span className=" text-[13px] font-medium text-hw-grey-900">{details[0]}</span>
          <span className=" text-[11px] font-normal text-hw-grey-500">{details[1]}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <time className=" text-[11px] font-normal">{date}</time>
        <div className={cn("text-[11px] text-nowrap font-medium rounded-xl py-1 px-2.5", TONE_STYLES[tone=='Pending'?'Pending':'In Review'].chip)}>
          {tone}
        </div>
        <Button variant={"secondary"} onClick={()=> onClick("coming soon!")} className={"text-xs font-medium cursor-pointer bg-hw-secondary text-hw-base-white hover:text-hw-secondary"}>
          {action}
        </Button>
      </div>
    </div>
  )
}

const ArtisanDisputes = () => {
  const [data, setData] = useState(ARTISAN)
  const [dataDispute, setDataDispute] = useState(DISPUTES)
  

  return (
    <>
      <div className={CLASSNAME}>
        <GridRowHead
          titles={["Pending Artisan Approvals","applications awaiting review — sample data"]}
          icon={{icon:Shield}}
          dataLength={data.length}
          route={ROUTES.artisans}
          className="text-hw-secondary bg-[#EFF5FF]"
        />
        
        {
          (data.length>0) &&
          data.slice(0, 4).map((value, index) => (
            <GridRowCard
              key={index}
              initials={<InitialsTemp name={value.name} className=" text-hw-secondary bg-[#EFF5FF]" />}
              details={[value.name, `${value.role +' · '+ value.location}`]}
              tone="Pending"
              action="Approve"
              date={`Submitted ${formatActivityDay(value.createdAt)}`}
              onClick={(val)=> toast(val)}
            />
          ))
        }
      </div>

      <div className={CLASSNAME}>
        <GridRowHead
          titles={["Open Disputes & Support","open cases — payment and misconduct — sample data"]}
          icon={{icon:Headphones}}
          dataLength={dataDispute.length}
          route={ROUTES.artisans}
          className="text-hw-primary bg-[#FEF1ED]"
        />
        {
          (dataDispute.length>0) &&
          dataDispute.slice(0, 4).map((value, index) => (
            <GridRowCard
              key={index}
              details={[`#${value.code.concat(" · ", value.dispute)}`, `${value.customer.concat(" Vs. ", value.artisan, ` (${value.role})`)}`]}
              tone={value.solution}
              action="Resolve"
              date={formatActivityDate(value.timeStamp)}
              onClick={(val)=> toast(val)}
            />
          ))
        }
      </div>
    </>
  )
}

export default ArtisanDisputes