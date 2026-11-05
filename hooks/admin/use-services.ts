import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/query/keys"
import {
  adminCategoriesQuery,
  adminServicesQuery,
  createServiceMutation,
  deleteServiceMutation,
  updateServiceMutation,
} from "@/services/admin/services"

export const useAdminServices = () => useQuery(adminServicesQuery())

export const useAdminCategories = () => useQuery(adminCategoriesQuery())

const useRefreshServices = () => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.services() })
}

/** The form shows its own errors */
export const useCreateService = () => {
  const refresh = useRefreshServices()
  return useMutation({ ...createServiceMutation(), meta: { silentError: true }, onSuccess: refresh })
}

export const useUpdateService = ({ silentError = false } = {}) => {
  const refresh = useRefreshServices()
  return useMutation({ ...updateServiceMutation(), meta: { silentError }, onSuccess: refresh })
}

export const useDeleteService = () => {
  const refresh = useRefreshServices()
  return useMutation({ ...deleteServiceMutation(), onSuccess: refresh })
}
