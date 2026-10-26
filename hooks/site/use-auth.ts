import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { registerMutation, siteSignInMutation } from "@/services/site/auth"

export const useSiteSignIn = () =>
  useMutation({
    ...siteSignInMutation(),
    onSuccess: () => {
      toast.success("Welcome back!")
    },
  })

export const useRegister = () =>
  useMutation({
    ...registerMutation(),
    onSuccess: () => {
      toast.success("You have successfully registered this account")
    },
  })
