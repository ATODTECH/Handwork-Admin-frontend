"use client"

import SectionCard from "@/components/account/section-card"
import { hasLocation, useOnboardingProgress } from "@/hooks/account/use-artisan-onboarding"
import LocationStep from "./onboarding/location-step"

/**
 * Artisans who finished onboarding before it asked for a location (or signed up elsewhere without
 * one) add it here. Customers search by area, and staff can't approve an artisan without it.
 */
const LocationPrompt = () => {
  const { data: profile } = useOnboardingProgress()
  if (!profile || hasLocation(profile)) return null

  return (
    <SectionCard
      title="Add your location"
      description="Customers look for artisans near them. Tell us where you're based so they can find you."
    >
      <LocationStep submitLabel="Save location" />
    </SectionCard>
  )
}

export default LocationPrompt
