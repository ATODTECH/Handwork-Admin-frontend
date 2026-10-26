"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarCheck, ShieldCheck, Sparkles } from "lucide-react"
import { categoriesHero } from "@/assets/site"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAccountProfile } from "@/hooks/site/use-auth"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import { CATEGORY_LINKS } from "@/modules/site/categories-details/data"

const greeting = (hour: number) => (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening")

const WelcomeBanner = () => {
  // Null until hydrated, so the time-of-day greeting never mismatches the server render
  const profile = useAccountProfile()
  const firstName = profile?.name.split(" ")[0]
  const title = profile ? `${greeting(new Date().getHours())}${firstName ? `, ${firstName}` : ""}` : "Welcome back"

  return (
    <section className="relative overflow-hidden rounded-3xl bg-secondary-blue text-white shadow-xl shadow-secondary-blue/15">
      {/* Decorative glow + dot grid */}
      <div className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-hw-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-hw-secondary/60 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] bg-size-[18px_18px]" />

      <div className="relative grid lg:grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
          <Badge className="h-7 gap-1.5 border-white/15 bg-white/10 px-3 text-xs text-white backdrop-blur">
            <Sparkles className="size-3.5! text-hw-primary" />
            Verified artisans near you
          </Badge>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            <p className="max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
              What can we help you get done today? Book a skilled professional in minutes and pay safely when the job is done.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="h-11 px-5 shadow-lg shadow-hw-primary/30" render={<Link href="/categories" />} nativeButton={false}>
              Find an artisan
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 border-white/20 bg-white/5 px-5 text-white hover:bg-white/15 hover:text-white"
              render={<Link href={ACCOUNT_ROUTES.customerBookings} />}
              nativeButton={false}
            >
              <CalendarCheck data-icon="inline-start" />
              My bookings
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/50">Popular:</span>
            {CATEGORY_LINKS.slice(0, 4).map(({ id, name }) => (
              <Link
                key={id}
                href={`/categories/${id}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 transition-colors hover:border-hw-primary/60 hover:bg-hw-primary/15 hover:text-white"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-72 lg:block">
          {/* Masked rather than overlaid, so the photo fades into the banner with no seam */}
          <div className="absolute inset-0 mask-[linear-gradient(to_right,transparent,black_55%)]">
            <Image src={categoriesHero} alt="An artisan fixing a kitchen sink" fill sizes="(min-width: 1024px) 40vw, 0px" className="object-cover" priority />
            <div className="absolute inset-0 bg-secondary-blue/25" />
          </div>
          <div className="absolute right-6 bottom-6 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 pr-4 backdrop-blur-md">
            <span className="flex size-10 items-center justify-center rounded-xl bg-hw-text-green-solid">
              <ShieldCheck className="size-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold">Verified artisans</span>
              <span className="text-xs text-white/70">ID and bank details on file</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WelcomeBanner
