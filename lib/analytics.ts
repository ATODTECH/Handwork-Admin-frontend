import type { Analytics } from "@/types/admin/analytics"

const MONTH = new Intl.DateTimeFormat("en-NG", { month: "short", timeZone: "UTC" })
const MONTH_YEAR = new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric", timeZone: "UTC" })

/** "2026-11" → "Nov" (short) or "November 2026" */
export const monthLabel = (key: string, long = false) => {
  const [year, month] = key.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, 1))
  return (long ? MONTH_YEAR : MONTH).format(date)
}

/** Change against the previous window, or null when there's nothing to compare with */
export const percentChange = (current: number, previous: number) => {
  if (!previous) return null
  return Math.round(((current - previous) / previous) * 100)
}

export const changeLabel = (current: number, previous: number, period: string) => {
  const change = percentChange(current, previous)
  if (change === null) return current ? `New since the previous ${period}` : `Nothing in the previous ${period} either`
  if (change === 0) return `Same as the previous ${period}`
  return `${change > 0 ? "+" : ""}${change}% on the previous ${period}`
}

/** Share of a total as a whole percentage */
export const share = (part: number, total: number) => (total ? Math.round((part / total) * 100) : 0)

const csvCell = (value: string | number) => {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** The month-by-month figures as a CSV file, one row per month */
export const analyticsCsv = ({ months, series }: Analytics) => {
  const header = ["Month", "Our fees (NGN)", "Job value released (NGN)", "Bookings", "Jobs completed", "Requests posted", "New customers", "New artisans"]
  const rows = months.map((month, index) => [
    month,
    series.fees[index],
    series.job_value[index],
    series.bookings[index],
    series.completed[index],
    series.requests[index],
    series.new_customers[index],
    series.new_artisans[index],
  ])
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")
}

export const downloadFile = (name: string, contents: string, type = "text/csv;charset=utf-8") => {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const link = Object.assign(document.createElement("a"), { href: url, download: name })
  link.click()
  URL.revokeObjectURL(url)
}
