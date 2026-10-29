import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { session } from "@/lib/auth/session"
import { queryKeys } from "@/lib/query/keys"
import { ROUTES } from "@/lib/routes"
import { adminSignInMutation } from "@/services/admin/auth"

/** Only follow `?next=` to a page inside the admin area (prevents open redirects) */
const getRedirectTarget = () => {
  const next = new URLSearchParams(window.location.search).get("next")
  return next?.startsWith("/admin/") && !next.startsWith("//") ? next : ROUTES.dashboard
}

/** Signs staff out of the admin console only; a customer/artisan session in the same browser stays */
export const useAdminSignOut = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return () => {
    session.clear()
    queryClient.removeQueries({ queryKey: queryKeys.admin.all })
    router.replace(ROUTES.login)
  }
}

export const useAdminSignIn = () => {
  const router = useRouter()

  return useMutation({
    ...adminSignInMutation(),
    onSuccess: (data) => {
      session.save(data)
      const name = data.name?.trim()
      toast.success(name ? `Welcome back, ${name}!` : "Welcome back!")
      router.replace(getRedirectTarget())
    },
  })
}
