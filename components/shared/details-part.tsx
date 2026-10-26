import { cn } from "cn"


/** A titled block inside a detail panel. */
export const DetailSection = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <section className={cn("py-5", className)}>
    <h4 className="text-xs font-semibold uppercase text-hw-grey-text-900 pb-3">{title}</h4>
    {children}
  </section>
)

/** One "label: value" line; shows "Not provided" when the value is empty. */
export const DetailRow = ({ label, className, children }: { label: string, className?: string, children: React.ReactNode }) => (
  <div className="flex flex-col 425xl:flex-row items-start justify-between gap-2 py-1 text-[13px] text-hw-grey-900 hover:bg-slate-50">
    <span className="font-medium text-nowrap">{label}</span>
    <span className={cn(" 425xl:text-right font-normal text-[#626773]", className)}>{children ?? "Not provided"}</span>
  </div>
)
