import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/query/keys"
import { createReportMutation, myReportsQuery } from "@/services/account/reports"

export const useMyReports = () => useQuery(myReportsQuery())

/** Someone flags an account, request, offer, message, booking or review for our team */
export const useCreateReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...createReportMutation(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.myReports() })
      toast.success("Thanks for telling us. Our team will look into it and let you know the outcome.")
    },
  })
}
