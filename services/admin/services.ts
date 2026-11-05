import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { AdminCategory, AdminService, ServicePayload } from "@/types/admin/services"

// Staff-only endpoints; router routes have no trailing slash
export const adminServicesService = {
  list: (signal?: AbortSignal) => http.get<AdminService[]>("/api/admin/services", { signal }),
  categories: (signal?: AbortSignal) => http.get<AdminCategory[]>("/api/category", { signal }),
  create: (payload: ServicePayload) => http.post<AdminService>("/api/admin/services", payload),
  update: ({ id, ...changes }: Partial<ServicePayload> & { id: number, active?: boolean }) =>
    http.patch<AdminService>(`/api/admin/services/${id}`, changes),
  /** Refused while artisans or bookings use the service */
  remove: (id: number) => http.delete(`/api/admin/services/${id}`),
}

export const adminServicesQuery = () =>
  queryOptions({
    queryKey: queryKeys.admin.services(),
    queryFn: ({ signal }) => adminServicesService.list(signal),
  })

export const adminCategoriesQuery = () =>
  queryOptions({
    queryKey: queryKeys.admin.categories(),
    queryFn: ({ signal }) => adminServicesService.categories(signal),
    staleTime: 10 * 60_000,
  })

export const createServiceMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.createService,
    mutationFn: adminServicesService.create,
  })

export const updateServiceMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.updateService,
    mutationFn: adminServicesService.update,
  })

export const deleteServiceMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.admin.deleteService,
    mutationFn: adminServicesService.remove,
  })
