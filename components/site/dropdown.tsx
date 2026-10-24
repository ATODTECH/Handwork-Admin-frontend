import { ChevronDown } from "lucide-react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { cn } from "cn"
import React from "react"


export const DropdownButton = ({title, className}: {title: string, className: string}) => {
  return (
    <DropdownMenuTrigger
      render={<Button variant="secondary" className={cn("h-8 w-auto py-2 px-2.5 hover:bg-hw-base-white hover:text-hw-grey-text-900 transition-colors", className)} />}
    >
      <span>{title}</span>
      <ChevronDown className="h-4 w-4" />
    </DropdownMenuTrigger>
  )
}

export const DropdownRegister = ({ 
  action,
  button,
  content,
  className,
  classNameBtn,
  onclick ,
}: {
  action: string, 
  button: React.ReactNode, 
  content: string[], 
  className?: string,
  classNameBtn?: string,
  onclick:(val: string, mode: string)=> void,
}) => {
  return (
    <DropdownMenu>
      { button ?? 
        <DropdownMenuTrigger
          render={<button className={cn("h-8 w-auto py-2 px-2.5", classNameBtn)} />}
        >
          <span>{action}</span>
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>
      }
      <DropdownMenuContent align="end" className={cn("min-w-48 divide-y divide-hw-grey-200", className)}>
        {
          content.map((item, i)=> (
            <DropdownMenuItem key={i} className={'focus:text-hw-primary focus:bg-primary-white py-2'} onClick={()=> onclick(action, item)}>{item}</DropdownMenuItem>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

