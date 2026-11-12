"use client"

import { useState } from "react"
import { BadgeCheck, BriefcaseBusiness, Download, HandCoins, ReceiptText, UserPlus, Wrench } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import SectionCard from "@/components/account/section-card"
import StatCard from "@/components/account/stat-card"
import { FilterTabs } from "@/components/shared/filter-tabs"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAdminAnalytics } from "@/hooks/admin/use-analytics"
import { usePageHeading } from "@/hooks/admin/use-page-heading"
import { analyticsCsv, changeLabel, downloadFile, monthLabel, share } from "@/lib/analytics"
import { formatCount, formatNairaAmount } from "@/lib/format"
import type { Analytics, AnalyticsRange } from "@/types/admin/analytics"
import MonthlyChart from "./monthly-chart"

const RANGES: { value: `${AnalyticsRange}`, label: string }[] = [
  { value: "3", label: "3 months" },
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months" },
]

const COMPACT = new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 })
const nairaAxis = (value: number) => `₦${COMPACT.format(value)}`
const count = (value: number) => formatCount(value)
const numbers = (values: (string | number)[]) => values.map((value) => Number(value) || 0)

const Headlines = ({ data, period }: { data: Analytics, period: string }) => {
  const { totals: now, previous: before } = data
  const tiles = [
    { label: "Our fees", value: formatNairaAmount(now.fees), current: Number(now.fees), prior: Number(before.fees), icon: HandCoins, tone: "brand" as const },
    { label: "Job value released", value: formatNairaAmount(now.job_value), current: Number(now.job_value), prior: Number(before.job_value), icon: ReceiptText, tone: "info" as const },
    { label: "Bookings", value: count(now.bookings), current: now.bookings, prior: before.bookings, icon: BriefcaseBusiness, tone: "info" as const },
    { label: "Jobs completed", value: count(now.completed), current: now.completed, prior: before.completed, icon: BadgeCheck, tone: "success" as const },
    { label: "New customers", value: count(now.new_customers), current: now.new_customers, prior: before.new_customers, icon: UserPlus, tone: "neutral" as const },
    { label: "New artisans", value: count(now.new_artisans), current: now.new_artisans, prior: before.new_artisans, icon: Wrench, tone: "neutral" as const },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {tiles.map(({ label, value, current, prior, icon, tone }) => (
        <StatCard key={label} label={label} value={value} hint={changeLabel(current, prior, period)} icon={icon} tone={tone} />
      ))}
    </div>
  )
}

const FunnelStep = ({ label, value, total }: { label: string, value: number, total: number }) => (
  <li className="flex flex-col gap-1.5">
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-hw-grey-700">{label}</span>
      <span className="font-medium text-hw-grey-900 tabular-nums">
        {formatCount(value)}
        {total > 0 && value !== total && <span className="ml-1.5 font-normal text-hw-grey-500">{share(value, total)}%</span>}
      </span>
    </div>
    <span className="h-2 overflow-hidden rounded-full bg-muted">
      <span className="block h-full rounded-full bg-[#2a78d6]" style={{ width: `${total ? (value / total) * 100 : 0}%` }} />
    </span>
  </li>
)

const Funnel = ({ funnel }: { funnel: Analytics["funnel"] }) => (
  <SectionCard title="From request to finished job" description="Requests posted in this period and how far they got.">
    {funnel.posted ? (
      <div className="flex flex-col gap-5">
        <ol className="flex flex-col gap-4">
          <FunnelStep label="Posted" value={funnel.posted} total={funnel.posted} />
          <FunnelStep label="Got at least one offer" value={funnel.with_offer} total={funnel.posted} />
          <FunnelStep label="Offer accepted" value={funnel.accepted} total={funnel.posted} />
          <FunnelStep label="Job finished and paid" value={funnel.completed} total={funnel.posted} />
        </ol>
        <dl className="grid grid-cols-2 gap-3 border-t border-hw-border pt-4 text-sm">
          <div className="flex flex-col">
            <dt className="text-xs text-hw-grey-500">Offers per request</dt>
            <dd className="font-medium text-hw-grey-900 tabular-nums">{funnel.average_offers}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-xs text-hw-grey-500">Typical wait for a first offer</dt>
            <dd className="font-medium text-hw-grey-900 tabular-nums">
              {funnel.median_hours_to_first_offer === null
                ? "No offers yet"
                : funnel.median_hours_to_first_offer < 1
                  ? "Under an hour"
                  : funnel.median_hours_to_first_offer < 48
                    ? `${Math.round(funnel.median_hours_to_first_offer)} hours`
                    : `${Math.round(funnel.median_hours_to_first_offer / 24)} days`}
            </dd>
          </div>
        </dl>
      </div>
    ) : (
      <p className="text-sm text-hw-grey-500">No requests were posted in this period.</p>
    )}
  </SectionCard>
)

const Health = ({ totals }: { totals: Analytics["totals"] }) => {
  const rows = [
    ["Paid to artisans", formatNairaAmount(totals.paid_to_artisans)],
    ["Refunds", totals.refunds ? `${formatCount(totals.refunds)} (${formatNairaAmount(totals.refunded_amount)})` : "None"],
    ["Problems reported", formatCount(totals.problems_reported)],
    ["Cancelled or declined", formatCount(totals.cancelled)],
    ["Artisans approved", formatCount(totals.artisans_approved)],
    ["Offers sent", formatCount(totals.offers)],
    ["Reviews", totals.reviews ? `${formatCount(totals.reviews)} · ${totals.average_rating?.toFixed(1)} average` : "None"],
    ["Reports from users", formatCount(totals.reports)],
  ]
  return (
    <SectionCard title="Also in this period">
      <dl className="flex flex-col divide-y divide-hw-border">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 py-2 text-sm first:pt-0 last:pb-0">
            <dt className="text-hw-grey-700">{label}</dt>
            <dd className="text-right font-medium text-hw-grey-900 tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  )
}

const Leaders = ({ data }: { data: Analytics }) => (
  <div className="grid gap-6 lg:grid-cols-2">
    <SectionCard title="Top categories" description="By bookings made in this period.">
      {data.top_categories.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Bookings</TableHead>
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right">Job value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.top_categories.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium text-hw-grey-900">{row.name}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCount(row.bookings)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCount(row.requests)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNairaAmount(row.job_value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-hw-grey-500">No bookings or requests yet in this period.</p>
      )}
    </SectionCard>
    <SectionCard title="Top artisans" description="By the value of jobs released to them in this period.">
      {data.top_artisans.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artisan</TableHead>
              <TableHead className="text-right">Jobs</TableHead>
              <TableHead className="text-right">Job value</TableHead>
              <TableHead className="text-right">They earned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.top_artisans.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-hw-grey-900">{row.name}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCount(row.jobs)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNairaAmount(row.job_value)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatNairaAmount(row.earned)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-hw-grey-500">No jobs released yet in this period.</p>
      )}
    </SectionCard>
  </div>
)

/** Every monthly figure as a table: what the charts show, readable without them */
const MonthlyTable = ({ data }: { data: Analytics }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Month</TableHead>
        <TableHead className="text-right">Our fees</TableHead>
        <TableHead className="text-right">Job value</TableHead>
        <TableHead className="text-right">Bookings</TableHead>
        <TableHead className="text-right">Completed</TableHead>
        <TableHead className="text-right">Requests</TableHead>
        <TableHead className="text-right">New customers</TableHead>
        <TableHead className="text-right">New artisans</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.months.map((month, index) => (
        <TableRow key={month}>
          <TableCell className="font-medium text-hw-grey-900">{monthLabel(month, true)}</TableCell>
          <TableCell className="text-right tabular-nums">{formatNairaAmount(data.series.fees[index])}</TableCell>
          <TableCell className="text-right tabular-nums">{formatNairaAmount(data.series.job_value[index])}</TableCell>
          <TableCell className="text-right tabular-nums">{formatCount(data.series.bookings[index])}</TableCell>
          <TableCell className="text-right tabular-nums">{formatCount(data.series.completed[index])}</TableCell>
          <TableCell className="text-right tabular-nums">{formatCount(data.series.requests[index])}</TableCell>
          <TableCell className="text-right tabular-nums">{formatCount(data.series.new_customers[index])}</TableCell>
          <TableCell className="text-right tabular-nums">{formatCount(data.series.new_artisans[index])}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

const ReportsSkeleton = () => (
  <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading">
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-28 rounded-2xl" />)}
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  </div>
)

/** Marketplace performance by month for staff, with a CSV download */
const ReportsIndex = () => {
  const heading = usePageHeading()
  const [range, setRange] = useState<AnalyticsRange>(6)
  const [asTable, setAsTable] = useState(false)
  const { data, isPending, isError, isFetching, refetch } = useAdminAnalytics(range)
  const period = `${range} months`

  return (
    <section className="flex flex-col gap-6">
      <PageHeader title={heading?.title ?? "Reports"} description={heading?.description ?? "How the marketplace is doing."} action={null} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs label="Period" tabs={RANGES} value={`${range}`} onChange={(next) => setRange(Number(next) as AnalyticsRange)} className="w-fit" />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={!data} onClick={() => setAsTable((table) => !table)}>
            {asTable ? "Show charts" : "Show as table"}
          </Button>
          <Button
            size="sm"
            disabled={!data}
            onClick={() => data && downloadFile(`handwork-expert-${data.months[0]}-to-${data.months.at(-1)}.csv`, analyticsCsv(data))}
          >
            <Download data-icon="inline-start" />
            Download CSV
          </Button>
        </div>
      </div>

      {isPending ? (
        <ReportsSkeleton />
      ) : isError || !data ? (
        <EmptyState
          icon={ReceiptText}
          title="Couldn't load the reports"
          description="Check your connection and try again."
          action={<Button onClick={() => refetch()}>Try again</Button>}
        />
      ) : (
        <div className={isFetching ? "flex flex-col gap-6 opacity-60 transition-opacity" : "flex flex-col gap-6 transition-opacity"}>
          <p className="-mt-2 text-xs text-hw-grey-500">
            {monthLabel(data.months[0], true)} to {monthLabel(data.months.at(-1) ?? data.months[0], true)}, compared with the {period} before.
          </p>
          <Headlines data={data} period={period} />

          {asTable ? (
            <SectionCard title="Month by month" contentClassName="overflow-x-auto">
              <MonthlyTable data={data} />
            </SectionCard>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="Our fees" description="10% of each job, counted when the artisan is paid.">
                <MonthlyChart
                  months={data.months}
                  series={[{ key: "fees", label: "Our fees", values: numbers(data.series.fees) }]}
                  format={formatNairaAmount}
                  axisFormat={nairaAxis}
                  label="Our fees by month"
                />
              </SectionCard>
              <SectionCard title="Bookings" description="Made each month, and jobs finished and paid out.">
                <MonthlyChart
                  months={data.months}
                  series={[
                    { key: "bookings", label: "Bookings made", values: data.series.bookings },
                    { key: "completed", label: "Jobs completed", values: data.series.completed },
                  ]}
                  format={count}
                  label="Bookings made and jobs completed by month"
                />
              </SectionCard>
              <SectionCard title="Sign-ups" description="New customer and artisan accounts.">
                <MonthlyChart
                  months={data.months}
                  series={[
                    { key: "customers", label: "Customers", values: data.series.new_customers },
                    { key: "artisans", label: "Artisans", values: data.series.new_artisans },
                  ]}
                  format={count}
                  label="New customers and artisans by month"
                />
              </SectionCard>
              <SectionCard title="Requests posted" description="Customers asking for offers, each month.">
                <MonthlyChart
                  months={data.months}
                  series={[{ key: "requests", label: "Requests posted", values: data.series.requests }]}
                  format={count}
                  label="Requests posted by month"
                />
              </SectionCard>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Funnel funnel={data.funnel} />
            <Health totals={data.totals} />
          </div>
          <Leaders data={data} />
        </div>
      )}
    </section>
  )
}

export default ReportsIndex
