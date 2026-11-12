"use client"

import { useState } from "react"
import { Check, Copy, Gift, MessageCircle, Share2, UserPlus } from "lucide-react"
import { cn } from "cn"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useMyReferrals } from "@/hooks/account/use-referrals"
import { formatActivityDate } from "@/lib/format"
import { SEMANTIC_TONES } from "@/lib/tones"
import type { MyReferrals } from "@/types/account/referrals"

type Viewer = "customer" | "artisan"

/** What each side earns, in their own words */
const COPY: Record<Viewer, { reward: (percent: string) => string, friend: string, steps: string[], share: (link: string) => string }> = {
  customer: {
    reward: (percent) => `${percent}% off your next booking`,
    friend: "friends who need something fixed, made or done",
    steps: [
      "Share your link with a friend.",
      "They sign up as a customer and book an artisan.",
      "When their first job is done and the artisan is paid, you get 5% off your next booking.",
    ],
    share: (link) => `I use Handwork Expert to find verified artisans, and you pay safely through the app. Sign up with my link: ${link}`,
  },
  artisan: {
    reward: (percent) => `${percent}% less taken from your next job`,
    friend: "other skilled artisans you trust",
    steps: [
      "Share your link with an artisan you trust.",
      "They sign up, get approved by our team and finish a job.",
      "When they're paid for their first job, we take 5% instead of 10% from your next job.",
    ],
    share: (link) => `I get jobs through Handwork Expert, and payments are safe. Join as an artisan with my link: ${link}`,
  },
}

const inviteLink = (code: string, viewer: Viewer) => {
  const origin = typeof window === "undefined" ? "" : window.location.origin
  return `${origin}/register?${viewer === "artisan" ? "role=artisan&" : ""}ref=${code}`
}

const ShareCard = ({ data, viewer }: { data: MyReferrals, viewer: Viewer }) => {
  const [copied, setCopied] = useState<"link" | "code" | null>(null)
  const link = inviteLink(data.code, viewer)
  const message = COPY[viewer].share(link)
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function"

  const copy = async (what: "link" | "code") => {
    try {
      await navigator.clipboard.writeText(what === "link" ? link : data.code)
      setCopied(what)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      setCopied(null)
    }
  }

  return (
    <SectionCard title="Your invite link" description={`Send it to ${COPY[viewer].friend}.`}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-xl border border-hw-border bg-muted/50 p-3 sm:flex-row sm:items-center">
          <code className="min-w-0 flex-1 truncate text-sm text-hw-grey-900">{link}</code>
          <Button variant="outline" size="sm" onClick={() => copy("link")}>
            {copied === "link" ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
            {copied === "link" ? "Copied" : "Copy link"}
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button render={<a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" />} nativeButton={false}>
            <MessageCircle data-icon="inline-start" />
            Share on WhatsApp
          </Button>
          {canShare && (
            <Button variant="outline" onClick={() => navigator.share({ text: message }).catch(() => undefined)}>
              <Share2 data-icon="inline-start" />
              More ways to share
            </Button>
          )}
          <span className="text-sm text-hw-grey-700">
            or give them your code{" "}
            <button type="button" onClick={() => copy("code")} className="rounded font-semibold text-hw-grey-900 underline decoration-dotted underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {data.code}
            </button>
            {copied === "code" && <span className="ml-1 text-xs text-hw-text-green-solid">copied</span>}
          </span>
        </div>
      </div>
    </SectionCard>
  )
}

const REWARD_STATUS = {
  AVAILABLE: { label: "Ready", tone: "success" as const },
  RESERVED: { label: "On a booking being paid", tone: "info" as const },
  USED: { label: "Used", tone: "neutral" as const },
}

/** Refer & earn for customers and artisans: the invite link, how it works, who signed up and rewards */
const ReferPage = ({ viewer }: { viewer: Viewer }) => {
  const { data, isPending, isError, refetch } = useMyReferrals()
  const copy = COPY[viewer]

  return (
    <>
      <PageHeader title="Refer & earn" description={`Invite ${copy.friend}. You get ${copy.reward("5")} for each one whose first job is done.`} />
      <QueryContent
        isPending={isPending}
        isError={isError}
        onRetry={refetch}
        isEmpty={!data}
        empty={null}
        skeleton={<Skeleton className="h-80 rounded-2xl" />}
      >
        {data && (
          <div className="flex flex-col gap-6">
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
              <ShareCard data={data} viewer={viewer} />
              <SectionCard title="Your rewards">
                <div className="flex items-center gap-4">
                  <span className={cn("flex size-12 items-center justify-center rounded-xl", SEMANTIC_TONES.brand.icon)}>
                    <Gift className="size-6" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-2xl font-semibold text-hw-grey-900 tabular-nums">{data.available}</span>
                    <span className="text-sm text-hw-grey-500">
                      {data.available ? `ready: ${copy.reward(String(Number(data.percent)))}, used automatically` : "ready to use"}
                    </span>
                  </div>
                </div>
              </SectionCard>
            </div>

            <SectionCard title="How it works">
              <ol className="grid gap-4 sm:grid-cols-3">
                {copy.steps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-hw-secondary">{index + 1}</span>
                    <span className="text-sm leading-relaxed text-hw-grey-700">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs leading-relaxed text-hw-grey-500">
                One reward for each friend, used on your next {viewer === "customer" ? "booking you pay for" : "job you're paid for"}, one per{" "}
                {viewer === "customer" ? "booking" : "job"}. Only {viewer === "customer" ? "customers inviting customers" : "artisans inviting artisans"} count.
                {viewer === "customer" && " If you cancel before paying, or we refund the booking, you get the discount back."}
              </p>
            </SectionCard>

            <SectionCard title="Who signed up">
              {data.referrals.length ? (
                <ul className="flex flex-col divide-y divide-hw-border">
                  {data.referrals.map((referral) => (
                    <li key={referral.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-hw-grey-900">{referral.name}</span>
                        <span className="text-xs text-hw-grey-500">Joined {formatActivityDate(referral.joined_at)}</span>
                      </div>
                      <Badge className={SEMANTIC_TONES[referral.status === "QUALIFIED" ? "success" : "warning"].chip}>
                        {referral.status === "QUALIFIED" ? "First job done: you earned a reward" : "Waiting for their first job"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon={UserPlus} title="Nobody yet" description="When someone signs up with your link or code, they'll show here." className="border-0 bg-transparent" />
              )}
            </SectionCard>

            {data.rewards.length > 0 && (
              <SectionCard title="Reward history">
                <ul className="flex flex-col divide-y divide-hw-border">
                  {data.rewards.map((reward) => (
                    <li key={reward.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-hw-grey-900">{copy.reward(String(Number(reward.percent)))}</span>
                        <span className="text-xs text-hw-grey-500">
                          Thanks to {reward.from} · earned {formatActivityDate(reward.earned_at)}
                          {reward.used_at && ` · used ${formatActivityDate(reward.used_at)}`}
                          {reward.booking_id && ` on booking #${reward.booking_id}`}
                        </span>
                      </div>
                      <Badge className={SEMANTIC_TONES[REWARD_STATUS[reward.status].tone].chip}>{REWARD_STATUS[reward.status].label}</Badge>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </div>
        )}
      </QueryContent>
    </>
  )
}

export default ReferPage
