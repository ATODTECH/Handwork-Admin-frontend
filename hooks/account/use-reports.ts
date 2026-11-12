import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { createReportMutation } from "@/services/account/reports"

/** Someone flags an account, request, offer, message, booking or review for our team */
export const useCreateReport = () =>
  useMutation({
    ...createReportMutation(),
    onSuccess: () => toast.success("Thanks for telling us. Our team will look into it and let you know the outcome."),
  })
