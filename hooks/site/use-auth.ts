import { LoginPost } from "@/api/site/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


const useSignIn = () =>
  useMutation({
    mutationFn: LoginPost,
    onSuccess: () => {
      toast.success(`Welcome back, ${""}!`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })


export default useSignIn