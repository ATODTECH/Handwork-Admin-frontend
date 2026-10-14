import { cn } from "cn";
import { initials } from "@/lib/format";

interface InitialsProps {
  className: string;
  name: string;
}

const InitialsTemp = ({ className, name }: InitialsProps) => {
  return (
    <div className={cn("flex items-center justify-center w-10 h-10 shrink-0 rounded-full border-[1.5px] border-hw-base-white", className)}>
      {initials(name)}
    </div>
  )
}

export default InitialsTemp