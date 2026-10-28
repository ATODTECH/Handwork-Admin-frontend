import { formatNairaAmount } from "@/lib/format"
import type { PublicArtisan, PublicSkill, ServiceCategory } from "@/types/account/marketplace"

export const artisanName = ({ first_name, last_name }: Pick<PublicArtisan, "first_name" | "last_name">) =>
  `${first_name} ${last_name}`.trim()

/** "₦5,000 – ₦20,000" */
export const priceRange = ({ base_charge, cap_charge }: Pick<PublicSkill, "base_charge" | "cap_charge">) =>
  `${formatNairaAmount(base_charge)} – ${formatNairaAmount(cap_charge)}`

export interface ArtisanFilters {
  query: string
  /** Category name, as in the overview's category tiles */
  category: string | null
  state: string | null
}

export const NO_FILTERS: ArtisanFilters = { query: "", category: null, state: null }

export const hasFilters = ({ query, category, state }: ArtisanFilters) => query.trim() !== "" || !!category || !!state

/** Filters the approved artisans in the browser; there are few enough to fetch them all */
export const filterArtisans = (artisans: PublicArtisan[], categories: ServiceCategory[], { query, category, state }: ArtisanFilters) => {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  const inCategory = category
    ? new Set(categories.find(({ name }) => name.toLowerCase() === category.toLowerCase())?.service.map(({ id }) => id))
    : null

  return artisans.filter((artisan) => {
    const services = artisan.skill?.services ?? []
    if (state && artisan.state !== state) return false
    if (inCategory && !services.some(({ id }) => inCategory.has(id))) return false
    if (!terms.length) return true
    const haystack = [artisanName(artisan), artisan.city, artisan.state, artisan.skill?.description, ...services.map(({ name }) => name)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
    return terms.every((term) => haystack.includes(term))
  })
}
