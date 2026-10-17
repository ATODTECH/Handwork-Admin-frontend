export type PageListItem = number | "ellipsis"

/** First, last, and the current page with its neighbours; gaps collapse to an ellipsis. */
export function getPageList(current: number, total: number): PageListItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: PageListItem[] = [1]
  if (current > 3) pages.push("ellipsis")
  for (let page = Math.max(2, current - 1); page <= Math.min(total - 1, current + 1); page++) pages.push(page)
  if (current < total - 2) pages.push("ellipsis")
  pages.push(total)
  return pages
}
