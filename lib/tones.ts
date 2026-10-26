/**
 * The semantic colours every status chip, stat card accent and note uses, so a
 * "success" looks the same on every page.
 */
export type Tone = "Pending" | "In Review"

export const TONE_STYLES: Record<Tone, { chip: string, dot: string, text: string }> = {
  Pending: { chip:"bg-[#FEF1ED] text-[#F56F46]", dot:"bg-[#F56F46]", text:"text-[#F56F46]" },
  "In Review": { chip:"bg-[#EFF5FF] text-[#1E338A]", dot:"bg-[#1E338A]", text:"text-[#1E338A]" },
}


/** Semantic tones for account dashboards: status badges, stat icons, progress accents */
export type SemanticTone = "brand" | "info" | "warning" | "success" | "danger" | "neutral"

export const SEMANTIC_TONES: Record<SemanticTone, { chip: string, icon: string, dot: string }> = {
  brand: { chip: "bg-[#FEF1ED] text-[#D9512A]", icon: "bg-[#FEF1ED] text-hw-primary", dot: "bg-hw-primary" },
  info: { chip: "bg-[#EFF5FF] text-hw-secondary", icon: "bg-[#EFF5FF] text-hw-secondary", dot: "bg-hw-secondary" },
  warning: { chip: "bg-hw-text-warning-50 text-hw-text-warning", icon: "bg-hw-text-warning-50 text-hw-text-warning", dot: "bg-[#F3A218]" },
  success: { chip: "bg-hw-bg-green text-hw-text-green-solid", icon: "bg-hw-bg-green text-hw-text-green-solid", dot: "bg-hw-text-green-solid" },
  danger: { chip: "bg-[#FFF0EF] text-[#C2271D]", icon: "bg-[#FFF0EF] text-[#C2271D]", dot: "bg-hw-text-red" },
  neutral: { chip: "bg-muted text-hw-grey-700", icon: "bg-muted text-hw-grey-700", dot: "bg-hw-grey-500" },
}
