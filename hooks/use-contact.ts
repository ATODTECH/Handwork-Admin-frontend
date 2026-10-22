import { ContactPost, SubscribePost } from "@/api/contact"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useContact = () =>
  useMutation({
    mutationFn: ContactPost,
    onSuccess: () => {
      toast.success("You have successfully submitted this form")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

export const useSubscribe = () =>
  useMutation({
    mutationFn: SubscribePost,
    onSuccess: () => {
      toast.success("Message successfully sent")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

