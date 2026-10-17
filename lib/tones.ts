/**
 * The semantic colours every status chip, stat card accent and note uses, so a
 * "success" looks the same on every page.
 */
export type Tone = "Pending" | "In Review"

export const TONE_STYLES: Record<Tone, { chip: string, dot: string, text: string }> = {
  Pending: { chip:"bg-[#FEF1ED] text-[#F56F46]", dot:"bg-[#F56F46]", text:"text-[#F56F46]" },
  "In Review": { chip:"bg-[#EFF5FF] text-[#1E338A]", dot:"bg-[#1E338A]", text:"text-[#1E338A]" },
}

