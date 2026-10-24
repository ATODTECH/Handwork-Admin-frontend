import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"

interface DialogRegisterProps {
  open: boolean
  onOpenChange: (isOpen:boolean)=> void
  title: string
  desc: string
  content: React.ReactNode
}
export const DialogRegister = ({
  open,
  title,
  desc,
  content,
  onOpenChange,
}: DialogRegisterProps) => {
  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-[90%] sm:max-w-[70%] lg:max-w-[50%] h-fit max-h-[90vh] overflow-hidden">
        <DialogHeader className="p-5 text-center">
          <DialogTitle className={"text-2xl sm:text-3xl font-bold"}>{title}</DialogTitle>
          <DialogDescription className={"flex flex-col text-sm sm:text-base font-semibold text-muted-foreground"}>
            <span className="">{desc}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin text-sm sm:text-base">{content}</div>
      </DialogContent>
    </Dialog>
  )
}
