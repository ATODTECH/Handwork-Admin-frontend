import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { contactMutation, subscribeMutation } from "@/services/site/contact"

export const useContact = () =>
  useMutation({
    ...contactMutation(),
    onSuccess: () => {
      toast.success("You have successfully submitted this form")
    },
  })

export const useSubscribe = () =>
  useMutation({
    ...subscribeMutation(),
    onSuccess: () => {
      toast.success("Message successfully sent")
    },
  })
