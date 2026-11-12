import { mutationOptions } from "@tanstack/react-query"
import { accountHttp } from "@/lib/http/client"
import { mutationKeys } from "@/lib/query/keys"
import type { MyReport, ReportPayload } from "@/types/account/reports"

// Router routes have no trailing slash (see `setup/urls.py` on the API)
export const reportsService = {
  /** Only what the reporter can see may be reported; anything else answers 404 */
  create: ({ target, reason, details }: ReportPayload) =>
    accountHttp.post<MyReport>("/api/reports", { target_type: target.type, target_id: String(target.id), reason, details }),
}

export const createReportMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.account.createReport, mutationFn: reportsService.create })
