import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/query/keys"
import { adminReportCountsQuery, adminReportsQuery, resolveReportMutation } from "@/services/admin/reports"
import type { ReportFilter } from "@/types/admin/reports"

export const useAdminReports = (status: ReportFilter) => useQuery(adminReportsQuery(status))

export const useAdminReportCounts = () => useQuery(adminReportCountsQuery())

/** Settling moves reports between tabs and changes the dashboard's open count */
export const useResolveReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...resolveReportMutation(),
    onSuccess: async ({ status, content_hidden }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.reportsRoot() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview() }),
      ])
      toast.success(
        status === "DISMISSED"
          ? "Report dismissed. We've told the reporter."
          : content_hidden
            ? "Removed and settled. We've told both sides."
            : "Settled. We've told the reporter.",
      )
    },
  })
}
