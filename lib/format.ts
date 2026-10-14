const COUNT = new Intl.NumberFormat("en-NG")
const MONTH = new Intl.DateTimeFormat("en-NG", { month: "short", timeZone: "Africa/Lagos" })
const TIME = new Intl.DateTimeFormat("en-NG", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Africa/Lagos" })
const DAY = new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos" })
const DAY_KEY = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" })

export const formatCount = (value: number) => COUNT.format(value)

/** Kobo in, a compact naira figure out: NGN 4.2M, NGN 850K, NGN 0. */
export const formatNaira = (amountMinor: number) => {
  const naira = amountMinor / 100
  if (naira >= 1_000_000) return `₦ ${(naira / 1_000_000).toFixed(1)}M`
  if (naira >= 1_000) return `₦ ${Math.round(naira / 1_000)}K`
  return `₦ ${COUNT.format(naira)}`
}

export const formatActivityDate = (iso: string, now = new Date()) => {
  const date = new Date(iso)
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  if (DAY_KEY.format(date) === DAY_KEY.format(now)) return `Today, ${TIME.format(date)}`
  if (DAY_KEY.format(date) === DAY_KEY.format(yesterday)) return `Yesterday, ${TIME.format(date)}`
  return DAY.format(date)
}

export const formatActivityDay = (iso: string, now = new Date()) => {
  const date = new Date(iso)
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  if (DAY_KEY.format(date) === DAY_KEY.format(now)) return "Today"
  if (DAY_KEY.format(date) === DAY_KEY.format(yesterday)) return "Yesterday"
  return DAY.format(date)
}

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

export const formatGrowthRate = (today: number, yesterday: number) => {
  const change = ((today - yesterday) / yesterday) * 100
  const roundedChange = Math.abs(change).toFixed(1)
  const direction = change >= 0 ? 'up' : 'down'
  return [roundedChange, direction]
}