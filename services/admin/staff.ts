import { mutationOptions, queryOptions } from "@tanstack/react-query"
import { http } from "@/lib/http/client"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type { CreatedStaff, NewStaff, PasswordChange, StaffMember, StaffRole } from "@/types/admin/staff"

// Staff-only endpoints; no trailing slashes
export const adminStaffService = {
  me: (signal?: AbortSignal) => http.get<StaffMember>("/api/admin/me", { signal }),
  /** Name, phone, or a new photo (multipart) */
  updateMe: (body: FormData | Partial<Pick<StaffMember, "first_name" | "last_name" | "contact">>) =>
    http.patch<StaffMember>("/api/admin/me", body),
  changePassword: (body: PasswordChange) => http.post<{ detail: string }>("/api/admin/me/password", body),
  list: (signal?: AbortSignal) => http.get<StaffMember[]>("/api/admin/staff", { signal }),
  // Admins only
  create: (body: NewStaff) => http.post<CreatedStaff>("/api/admin/staff", body),
  setRole: ({ id, role }: { id: string, role: StaffRole }) => http.post<StaffMember>(`/api/admin/staff/${id}/role`, { role }),
  deactivate: (id: string) => http.post<StaffMember>(`/api/admin/staff/${id}/deactivate`),
  reactivate: (id: string) => http.post<StaffMember>(`/api/admin/staff/${id}/reactivate`),
}

export const staffMeQuery = () =>
  queryOptions({ queryKey: queryKeys.admin.me(), queryFn: ({ signal }) => adminStaffService.me(signal), staleTime: 5 * 60_000 })

export const staffListQuery = () =>
  queryOptions({ queryKey: queryKeys.admin.staff(), queryFn: ({ signal }) => adminStaffService.list(signal) })

export const updateMeMutation = () => mutationOptions({ mutationKey: mutationKeys.admin.updateMe, mutationFn: adminStaffService.updateMe })
export const changePasswordMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.admin.changePassword, mutationFn: adminStaffService.changePassword })
export const createStaffMutation = () => mutationOptions({ mutationKey: mutationKeys.admin.createStaff, mutationFn: adminStaffService.create })
export const setStaffRoleMutation = () => mutationOptions({ mutationKey: mutationKeys.admin.setStaffRole, mutationFn: adminStaffService.setRole })
export const deactivateStaffMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.admin.deactivateStaff, mutationFn: adminStaffService.deactivate })
export const reactivateStaffMutation = () =>
  mutationOptions({ mutationKey: mutationKeys.admin.reactivateStaff, mutationFn: adminStaffService.reactivate })
