import { Metadata } from "next"
import ServicesIndex from "@/modules/services-management"

export const metadata: Metadata = {
  title: "Services - HandworkExpert",
}

const ServicesPage = () => <ServicesIndex />

export default ServicesPage
