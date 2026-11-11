import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { adminAnalyticsQuery } from "@/services/admin/analytics"
import type { AnalyticsRange } from "@/types/admin/analytics"

/** Marketplace figures for the Reports page; the last range stays up while a new one loads */
export const useAdminAnalytics = (months: AnalyticsRange) => useQuery({ ...adminAnalyticsQuery(months), placeholderData: keepPreviousData })
