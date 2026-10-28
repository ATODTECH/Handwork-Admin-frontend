import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { queryKeys } from "@/lib/query/keys"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import { artisanQuery, artisansQuery, bookArtisanMutation, categoriesQuery } from "@/services/account/marketplace"

export const useArtisans = () => useQuery(artisansQuery())

export const useArtisan = (id: string) => useQuery(artisanQuery(id))

export const useCategories = () => useQuery(categoriesQuery())

/** Sends the request, then shows it in My bookings */
export const useBookArtisan = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    ...bookArtisanMutation(),
    meta: { silentError: true },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.account.bookings() })
      toast.success("Booking sent. We'll let you know when the artisan replies.")
      router.push(ACCOUNT_ROUTES.customerBookings)
    },
  })
}
