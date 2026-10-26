import type { StaticImageData } from "next/image"
import {
  service, shopping, dressmaker, seaport1, seaport2, seaport3, plumber, woodcutting, interior, happyPainter,
  construction, electrician, packaging, dispatch, transport, loading, lawnmower, container, farmEquipment,
  seedFertilizer, farmManagement, manVegetables, deliveryMarket, carWash, autoElect, airConditioner, shoeMaker,
  generatorService, welder, webDev, softwareDev, digitalMarketer, gameDev, ITconsulting, gadgetRepair,
  agriculture, automotive, clothingStore, exportServices, homesProperty, logisticsWarehousing, techIT,
} from "@/assets/site"

export interface CategoryListing {
  avatar: StaticImageData
  backdropImage: StaticImageData
  title: string
  ratings: number
  phoneNumber: string
  location: string
  amount: string
  negotiable: boolean
}

export interface CategoryDetails {
  category: string
  categoryList: CategoryListing[]
}

/** Category slugs used in /categories/[id], the nav, the footer and the dashboards */
export const CATEGORY_LINKS = [
  { id: "fashion", name: "Fashion And Beauty", image: clothingStore },
  { id: "export", name: "Export Services", image: exportServices },
  { id: "property", name: "Home And Property", image: homesProperty },
  { id: "logistics", name: "Logistics And Warehousing", image: logisticsWarehousing },
  { id: "agriculture", name: "Agriculture", image: agriculture },
  { id: "automotive", name: "Automotive", image: automotive },
  { id: "tech-IT", name: "Tech/IT", image: techIT },
] as const

const listing = (
  image: StaticImageData,
  title: string,
  ratings: number,
  amount: string,
  negotiable: boolean,
): CategoryListing => ({
  avatar: image,
  backdropImage: image,
  title,
  ratings,
  phoneNumber: "xxxxxxxxx19",
  location: "Lagos, Nigeria",
  amount,
  negotiable,
})

// placeholder data until the categories API is wired up
export const CATEGORY_DETAILS: Record<string, CategoryDetails> = {
  fashion: {
    category: "Fashion And Beauty",
    categoryList: [
      listing(service, "Fashion And Design.. Wholesalers And Retailers", 0, "20000.00", false),
      listing(dressmaker, "Fashion And Design.. Wholesalers And Retailers", 0, "30000.00", true),
      listing(shopping, "Fashion And Design.. Wholesalers And Retailers", 5, "30000.00", false),
      listing(shopping, "Fashion And Design.. Wholesalers And Retailers", 5, "30000.00", true),
      listing(service, "Fashion And Design.. Wholesalers And Retailers", 1, "30000.00", true),
      listing(dressmaker, "Fashion And Design.. Wholesalers And Retailers", 5, "30000.00", false),
      listing(dressmaker, "Fashion And Design.. Wholesalers And Retailers", 5, "30000.00", true),
      listing(service, "Fashion And Design.. Wholesalers And Retailers", 5, "30000.00", true),
    ],
  },
  export: {
    category: "Export Services",
    categoryList: [
      listing(seaport1, "Airgate Firm", 0, "200000.00", false),
      listing(seaport2, "Happy General merchants", 0, "300000.00", true),
      listing(seaport3, "Belgium Shoes and Wholesale products", 5, "300000.00", false),
      listing(seaport2, "Fashion And Design.. Wholesalers And Retailers", 5, "300000.00", true),
      listing(seaport1, "Airgate Firm", 1, "300000.00", true),
      listing(seaport3, "Belgium Tyres", 5, "300000.00", false),
    ],
  },
  property: {
    category: "Home And Property",
    categoryList: [
      listing(plumber, "Plumber", 0, "20000.00", false),
      listing(woodcutting, "Carpenter", 0, "30000.00", true),
      listing(interior, "Happiness Home Decoration", 5, "30000.00", false),
      listing(happyPainter, "Happy Painters", 5, "30000.00", true),
      listing(construction, "Construction", 1, "30000.00", true),
      listing(electrician, "Goodwill Electricians", 5, "30000.00", false),
    ],
  },
  logistics: {
    category: "Logistics And Warehousing",
    categoryList: [
      listing(packaging, "Packaging Services", 0, "20000.00", false),
      listing(dispatch, "Dispatch Services", 0, "30000.00", true),
      listing(transport, "Grace Transportation Service", 5, "30000.00", false),
      listing(loading, "Loading And Unloading Service", 5, "30000.00", true),
      listing(lawnmower, "Lawn Mower", 1, "30000.00", true),
      listing(container, "Container Drayage Service", 5, "30000.00", false),
    ],
  },
  agriculture: {
    category: "Agriculture",
    categoryList: [
      listing(container, "Agri Products", 0, "20000.00", false),
      listing(farmEquipment, "Farm Equipment Rental Service", 0, "30000.00", true),
      listing(seedFertilizer, "Seed And Fertilizer Supply Service", 5, "30000.00", false),
      listing(farmManagement, "Farm management And Planning Service", 5, "30000.00", true),
      listing(manVegetables, "Agri Products", 1, "30000.00", true),
      listing(deliveryMarket, "Container Drayage Service", 5, "30000.00", false),
    ],
  },
  automotive: {
    category: "Automotive",
    categoryList: [
      listing(carWash, "Car Wash", 0, "20000.00", false),
      listing(autoElect, "Auto Electrician", 0, "30000.00", true),
      listing(airConditioner, "Air Condition (AC) Repairers", 5, "30000.00", false),
      listing(shoeMaker, "Shoe Makers", 5, "30000.00", true),
      listing(generatorService, "Generator Service", 1, "30000.00", true),
      listing(welder, "Welder", 5, "30000.00", false),
    ],
  },
  "tech-IT": {
    category: "Tech/IT",
    categoryList: [
      listing(webDev, "Website Development", 0, "500000.00", false),
      listing(softwareDev, "Software Development", 0, "300000.00", true),
      listing(digitalMarketer, "Digital Marketing Service", 5, "300000.00", false),
      listing(gameDev, "Game Development", 5, "300000.00", true),
      listing(ITconsulting, "IT Consulting Service", 1, "300000.00", true),
      listing(gadgetRepair, "Gadget Repair", 0, "300000.00", true),
    ],
  },
}
