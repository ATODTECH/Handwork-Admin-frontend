import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "cn"


interface DetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  className?: string
}

export const DetailSheet = ({ open, onOpenChange, title, children, className }: DetailSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="right" className={cn("w-full gap-0 bg-hw-base-white p-0 sm:max-w-105", className)}>
      <SheetHeader className="px-6 py-5 border-b border-b-hw-grey-200">
        <SheetTitle className="text-lg font-semibold text-hw-grey-900">{title} details</SheetTitle>
      </SheetHeader>
      <div className="flex flex-1 flex-col gap-y-7 overflow-y-auto px-6 py-5 scrollbar-thin">{children}</div>
    </SheetContent>
  </Sheet>
)
