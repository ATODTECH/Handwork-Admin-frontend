import { RegisterationPost } from "@/api/site/form"
import { ApiError } from "@/lib/axios-config"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useRegister = () => 
  useMutation({
    mutationFn: RegisterationPost,
    onSuccess: () => {
      toast.success("You have successfully registered this account")
    },
    onError: (error, payload) => {
      toast.error(error.message)
      new ApiError(error.message ?? "Registration failed. Please try again.", 0, error.cause);
    },
  })
