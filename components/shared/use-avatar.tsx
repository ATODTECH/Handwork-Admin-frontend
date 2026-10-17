import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { initials } from "@/lib/format"
import { cn } from "cn"

interface AvatarProps {
  src: string
  name: string
  aspectRatio: string
  className?: string
}

const CLASSNAME = "text-hw-secondary bg-[#E9EBF3] font-semibold"

export function UseAvatar({
  src,
  name,
  aspectRatio,
  className="text-lg",
}: AvatarProps) {
  return (
    <div className="flex flex-row flex-wrap items-center gap-6 md:gap-12">
      <Avatar className={cn("shrink-0", aspectRatio)}>
        <AvatarImage
          src={src}
          alt={name}
        />
        <AvatarFallback
          className={cn(CLASSNAME, className)}
        >{initials(name)}</AvatarFallback>
      </Avatar>
    </div>
  )
}
