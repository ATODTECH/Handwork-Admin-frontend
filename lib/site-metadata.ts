import type { Metadata } from "next"

const SITE_NAME = "Handwork Expert"
const DEFAULT_IMAGE = "/og-image.jpg"
export const DEFAULT_DESCRIPTION =
  "Handwork Expert connects you with verified, skilled artisans for plumbing, electrical work, painting, carpentry, and more. Book trusted professionals near you in minutes."

interface SiteMetadataOptions {
  title: string
  description?: string
  /** path for the canonical URL, e.g. "/about-us" */
  path: string
}

/**
 * Page metadata for the public site: title, canonical, Open Graph and Twitter card.
 * Next replaces (not merges) nested objects like openGraph, so every page sets them in full.
 */
export const siteMetadata = ({ title, description = DEFAULT_DESCRIPTION, path }: SiteMetadataOptions): Metadata => {
  const fullTitle = `${title} | ${SITE_NAME}`

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: path,
      images: [DEFAULT_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [DEFAULT_IMAGE],
    },
  }
}
