import { NextResponse } from "next/server"
import type { Bank } from "@/types/account/artisan"

const PAYSTACK_BANKS_URL = "https://api.paystack.co/bank?country=nigeria&perPage=100&use_cursor=false"
const ONE_DAY_SECONDS = 60 * 60 * 24

interface PaystackBank {
  name: string
  code: string
  active?: boolean
  is_deleted?: boolean
}

/**
 * Nigerian banks for the artisan payout form. Proxied (and cached for a day) so the browser
 * doesn't depend on Paystack's CORS policy or availability on every page load.
 */
export async function GET() {
  try {
    const response = await fetch(PAYSTACK_BANKS_URL, { next: { revalidate: ONE_DAY_SECONDS } })
    if (!response.ok) throw new Error(`Paystack answered ${response.status}`)

    const { data } = (await response.json()) as { data?: PaystackBank[] }
    const seen = new Set<string>()
    const banks: Bank[] = (data ?? [])
      .filter(({ name, active, is_deleted }) => active !== false && !is_deleted && !seen.has(name) && seen.add(name))
      .map(({ name, code }) => ({ name, code }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(banks, {
      headers: { "Cache-Control": `public, s-maxage=${ONE_DAY_SECONDS}, stale-while-revalidate=${ONE_DAY_SECONDS}` },
    })
  } catch {
    return NextResponse.json({ detail: "Couldn't load the list of banks." }, { status: 502 })
  }
}
