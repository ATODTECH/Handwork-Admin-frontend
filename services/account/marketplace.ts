import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { accountSession } from "@/lib/auth/session"
import { accountHttp } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { Booking } from "@/types/account/dashboard"
import type { BookingPayload, PublicArtisan, ServiceCategory } from "@/types/account/marketplace"

// Router routes have no trailing slash (see `setup/urls.py` on the API)
export const marketplaceService = {
  // Public reads skip the token: the public site uses them too, and an expired session
  // there shouldn't bounce a visitor to sign-in
  /** Only artisans staff have approved */
  artisans: (signal?: AbortSignal) => accountHttp.get<PublicArtisan[]>("/api/artisan", { signal, skipAuth: true }),
  artisan: (id: string, signal?: AbortSignal) => accountHttp.get<PublicArtisan>(`/api/artisan/${id}`, { signal, skipAuth: true }),
  categories: (signal?: AbortSignal) => accountHttp.get<ServiceCategory[]>("/api/category", { signal, skipAuth: true }),

  bookArtisan: ({ artisanId, serviceIds, description, budget, address, date, time }: BookingPayload) =>
    accountHttp.post<Booking>("/api/book/artisan", {
      artisan: artisanId,
      // The API now takes the customer from the token; older deploys still require it in the body
      client: accountSession.getUserId(),
      services: serviceIds,
      description,
      budget: String(budget),
      address,
      scheduled_date: date,
      scheduled_time: time,
    }),
}

export const artisansQuery = () =>
  queryOptions({
    queryKey: queryKeys.account.artisans(),
    queryFn: ({ signal }) => marketplaceService.artisans(signal),
  })

export const artisanQuery = (id: string) =>
  queryOptions({
    queryKey: queryKeys.account.artisan(id),
    queryFn: ({ signal }) => marketplaceService.artisan(id, signal),
  })

export const categoriesQuery = () =>
  queryOptions({
    queryKey: queryKeys.account.categories(),
    queryFn: ({ signal }) => marketplaceService.categories(signal),
    staleTime: 10 * 60_000,
  })

export const bookArtisanMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.bookArtisan,
    mutationFn: marketplaceService.bookArtisan,
  })
