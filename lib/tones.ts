/**
 * The semantic colours every status chip, stat card accent and note uses, so a
 * "success" looks the same on every page.
 */
export type Tone = "Pending" | "In Review" | Status | "Suspend" | "Disable"

export const TONE_STYLES: Record<Tone, { chip?: string, text?: string }> = {
  Pending: { chip:"bg-[#FEF1ED] text-[#F56F46]", text:"text-[#F56F46]" },
  "In Review": { chip:"bg-[#EFF5FF] text-[#1E338A]", text:"text-[#1E338A]" },
  "Suspend": { chip:"flex-1 hover:bg-[#1E338A] bg-[#1E338A] text-[#FFFFFF]" },
  "Disable": { chip:"flex-1 hover:bg-[#FFFFFF] bg-[#FFFFFF] text-[#F2461D] border border-[#F2461D]" },
  "Verified": { text:"text-[#1E338A]" },
  "Not verified": { text:"text-[#C45938]" },
}

