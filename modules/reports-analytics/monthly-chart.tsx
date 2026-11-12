"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { monthLabel } from "@/lib/analytics"

/** Validated as a pair (dataviz validator, light surface): blue, orange */
export const SERIES_COLORS = ["#2a78d6", "#eb6834"] as const

export interface ChartSeries {
  key: string
  label: string
  values: number[]
}

interface MonthlyChartProps {
  months: string[]
  series: ChartSeries[]
  format: (value: number) => string
  /** Shorter numbers for the axis, e.g. ₦1.2m */
  axisFormat?: (value: number) => string
  /** Read out instead of the chart for screen readers */
  label: string
}

/** The parts of Recharts' tooltip entries this tooltip reads */
interface TooltipPayload {
  dataKey?: unknown
  value?: unknown
  color?: string
}

const ChartTooltip = ({ active, payload, label, series, format }: {
  active?: boolean
  payload?: readonly TooltipPayload[]
  label?: string | number
  series: ChartSeries[]
  format: (value: number) => string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="flex min-w-36 flex-col gap-1.5 rounded-lg border border-hw-border bg-white px-3 py-2 text-xs shadow-md">
      <span className="font-medium text-hw-grey-900">{monthLabel(String(label), true)}</span>
      {payload.map((item) => (
        <span key={String(item.dataKey)} className="flex items-center justify-between gap-4 text-hw-grey-700">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: item.color }} />
            {series.find(({ key }) => key === item.dataKey)?.label}
          </span>
          <span className="font-medium text-hw-grey-900 tabular-nums">{format(Number(item.value) || 0)}</span>
        </span>
      ))}
    </div>
  )
}

/** One or two measures by month as bars, with a hover tooltip and, for two, a legend */
const MonthlyChart = ({ months, series, format, axisFormat = format, label }: MonthlyChartProps) => {
  const data = months.map((month, index) => ({
    month,
    ...Object.fromEntries(series.map(({ key, values }) => [key, values[index] ?? 0])),
  }))

  return (
    <figure className="flex flex-col gap-3">
      {series.length > 1 && (
        <figcaption className="flex flex-wrap gap-4 text-xs text-hw-grey-700">
          {series.map(({ key, label: name }, index) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm" style={{ background: SERIES_COLORS[index] }} />
              {name}
            </span>
          ))}
        </figcaption>
      )}
      <div className="h-56 w-full" role="img" aria-label={label}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} barGap={2} barCategoryGap="28%">
            <CartesianGrid vertical={false} stroke="#ececec" />
            <XAxis
              dataKey="month"
              tickFormatter={(month: string) => monthLabel(month)}
              tickLine={false}
              axisLine={{ stroke: "#d9d9d9" }}
              tick={{ fontSize: 11, fill: "#6b6b6b" }}
            />
            <YAxis
              tickFormatter={(value: number) => axisFormat(value)}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#6b6b6b" }}
              width={56}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              content={(props) => <ChartTooltip {...props} series={series} format={format} />}
            />
            {series.map(({ key }, index) => (
              <Bar key={key} dataKey={key} fill={SERIES_COLORS[index]} radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}

export default MonthlyChart
