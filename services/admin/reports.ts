import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { ReportCounts, ReportFilter, ReportForStaff, ResolveReport } from "@/types/admin/reports"

/** The API sends `target` without saying what it is; tag it so the UI can narrow on `kind` */
const withKind = (report: ReportForStaff): ReportForStaff =>
  report.target ? { ...report, target: { ...report.target, kind: report.target_type } as ReportForStaff["target"] } : report

// Staff-only endpoints; router routes have no trailing slash
export const adminReportsService = {
  list: async (status: ReportFilter, signal?: AbortSignal) =>
    (await http.get<ReportForStaff[]>("/api/admin/reports", { params: { status }, signal })).map(withKind),
  counts: (signal?: AbortSignal) => http.get<ReportCounts>("/api/admin/reports/counts", { signal }),
  /** Settles this report and every other open report about the same thing */
  resolve: async ({ id, outcome, note, hide }: ResolveReport) =>
    withKind(await http.post<ReportForStaff>(`/api/admin/reports/${id}/resolve`, { outcome, note, hide })),
}

export const adminReportsQuery = (status: ReportFilter) =>
  queryOptions({
    queryKey: queryKeys.admin.reports(status),
    queryFn: ({ signal }) => adminReportsService.list(status, signal),
  })

export const adminReportCountsQuery = () =>
  queryOptions({
    queryKey: queryKeys.admin.reportCounts(),
    queryFn: ({ signal }) => adminReportsService.counts(signal),
  })

export const resolveReportMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.admin.resolveReport, mutationFn: adminReportsService.resolve })
