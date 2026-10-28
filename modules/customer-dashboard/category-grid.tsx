import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, LayoutGrid } from "lucide-react"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import { CATEGORY_LINKS } from "@/modules/site/categories-details/data"

const tileClass = "group relative flex aspect-4/3 overflow-hidden rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-hw-primary/50"

/** Photo tiles opening Find an artisan, filtered to that category */
const CategoryGrid = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
    {CATEGORY_LINKS.map(({ id, name, image }) => (
      <Link key={id} href={{ pathname: ACCOUNT_ROUTES.customerArtisans, query: { category: name } }} className={tileClass}>
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-linear-to-t from-secondary-blue/90 via-secondary-blue/30 to-transparent" />
        <span className="relative mt-auto flex w-full items-end justify-between gap-2 p-3.5">
          <span className="text-sm leading-tight font-semibold text-white">{name}</span>
          <ArrowUpRight className="size-4 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
        </span>
      </Link>
    ))}
    <Link href={ACCOUNT_ROUTES.customerArtisans} className={`${tileClass} items-center justify-center bg-[#FEF1ED] text-hw-primary ring-1 ring-hw-primary/15`}>
      <span className="flex flex-col items-center gap-2 text-sm font-semibold">
        <span className="flex size-11 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
          <LayoutGrid className="size-5" />
        </span>
        Browse all
      </span>
    </Link>
  </div>
)

export default CategoryGrid
