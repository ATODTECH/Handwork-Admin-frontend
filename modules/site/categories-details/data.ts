import {
  agriculture, automotive, clothingStore, exportServices, homesProperty, logisticsWarehousing, techIT,
} from "@/assets/site"

/**
 * Category slugs used in /categories/[id], the nav, the footer and the dashboards.
 * Each `name` matches a category in the API's catalogue (`services/catalog.py`).
 */
export const CATEGORY_LINKS = [
  { id: "fashion", name: "Fashion And Beauty", image: clothingStore },
  { id: "export", name: "Export Services", image: exportServices },
  { id: "property", name: "Home And Property", image: homesProperty },
  { id: "logistics", name: "Logistics And Warehousing", image: logisticsWarehousing },
  { id: "agriculture", name: "Agriculture", image: agriculture },
  { id: "automotive", name: "Automotive", image: automotive },
  { id: "tech-IT", name: "Tech/IT", image: techIT },
] as const

/** The category's name for a slug, or undefined for an unknown slug */
export const categoryName = (id: string) => CATEGORY_LINKS.find((link) => link.id === id)?.name
