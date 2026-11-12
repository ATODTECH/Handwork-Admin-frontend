import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/query/keys"
import {
  changePasswordMutation,
  createStaffMutation,
  deactivateStaffMutation,
  reactivateStaffMutation,
  setStaffRoleMutation,
  staffListQuery,
  staffMeQuery,
  updateMeMutation,
} from "@/services/admin/staff"
import type { StaffMember } from "@/types/admin/staff"

/** The signed-in staff member, with their role */
export const useStaffMe = () => useQuery(staffMeQuery())

/** Admins can move money and manage staff. Unknown (still loading) counts as no, so buttons don't flash. */
export const useIsStaffAdmin = () => useStaffMe().data?.role === "ADMIN"

export const useStaffList = () => useQuery(staffListQuery())

export const useUpdateMe = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...updateMeMutation(),
    onSuccess: (me) => {
      queryClient.setQueryData(queryKeys.admin.me(), me)
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.staff() })
      toast.success("Profile saved")
    },
  })
}

export const useChangePassword = () =>
  useMutation({ ...changePasswordMutation(), meta: { silentError: true }, onSuccess: () => toast.success("Password changed") })

const name = (member: StaffMember) => `${member.first_name} ${member.last_name}`.trim() || member.email

export const useCreateStaff = () => {
  const queryClient = useQueryClient()
  return useMutation({
    ...createStaffMutation(),
    meta: { silentError: true },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.staff() }),
  })
}

/** Role, deactivate and reactivate all refresh the list and name who changed */
const useStaffRefresh = (message: (member: StaffMember) => string) => {
  const queryClient = useQueryClient()
  return async (member: StaffMember) => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.admin.staff() })
    toast.success(message(member))
  }
}

export const useSetStaffRole = () => {
  const onSuccess = useStaffRefresh((member) => `${name(member)} is now ${member.role === "ADMIN" ? "an Admin" : "Support staff"}.`)
  return useMutation({ ...setStaffRoleMutation(), onSuccess })
}

export const useDeactivateStaff = () => {
  const onSuccess = useStaffRefresh((member) => `${name(member)} can no longer sign in.`)
  return useMutation({ ...deactivateStaffMutation(), onSuccess })
}

export const useReactivateStaff = () => {
  const onSuccess = useStaffRefresh((member) => `${name(member)} can sign in again.`)
  return useMutation({ ...reactivateStaffMutation(), onSuccess })
}
