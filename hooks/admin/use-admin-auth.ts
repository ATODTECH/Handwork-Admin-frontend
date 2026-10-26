import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { session } from "@/lib/auth/session"
import { ROUTES } from "@/lib/routes"
import { adminSignInMutation } from "@/services/admin/auth"

/** Only follow `?next=` to a page inside the admin area (prevents open redirects) */
const getRedirectTarget = () => {
  const next = new URLSearchParams(window.location.search).get("next")
  return next?.startsWith("/admin/") && !next.startsWith("//") ? next : ROUTES.dashboard
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
