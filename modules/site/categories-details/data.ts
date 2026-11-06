import {
  agriculture, automotive, clothingStore, exportServices, homesProperty, logisticsWarehousing, techIT,
} from "@/assets/site"

/**
 * Category slugs used in /categories/[id], the nav, the footer and the dashboards.
 * Each `name` matches a category in the API's catalogue (`services/catalog.py`).
 */
export const CATEGORY_LINKS = [
  {
    id: "fashion",
    name: "Fashion And Beauty",
    image: clothingStore,
    description: "Tailors, shoemakers, hair stylists, barbers, makeup artists and nail technicians.",
  },
  {
    id: "export",
    name: "Export Services",
    image: exportServices,
    description: "Freight forwarding, customs clearing, export paperwork and packaging.",
  },
  {
    id: "property",
    name: "Home And Property",
    image: homesProperty,
    description: "Plumbers, electricians, carpenters, painters, welders, tilers, cleaners and more.",
  },
  {
    id: "logistics",
    name: "Logistics And Warehousing",
    image: logisticsWarehousing,
    description: "Dispatch riders, haulage, packing and moving, loading and storage.",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    image: agriculture,
    description: "Farm management, equipment hire, farm inputs, gardening and produce delivery.",
  },
  {
    id: "automotive",
    name: "Automotive",
    image: automotive,
    description: "Mechanics, auto electricians, car wash, vulcanizers and panel beaters.",
  },
  {
    id: "tech-IT",
    name: "Tech/IT",
    image: techIT,
    description: "Websites, software, digital marketing, IT support, gadget repair and CCTV installation.",
  },
] as const

/** The category's name for a slug, or undefined for an unknown slug */
export const categoryName = (id: string) => CATEGORY_LINKS.find((link) => link.id === id)?.name
