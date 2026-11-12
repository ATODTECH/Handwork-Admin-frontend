"use client"

import { useState } from "react"
import { MoreHorizontal, UserPlus } from "lucide-react"
import SectionCard from "@/components/account/section-card"
import { ListSkeleton } from "@/components/account/query-content"
import { UseAvatar } from "@/components/shared/use-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import SubmitButton from "@/components/form/submit-button"
import { useDeactivateStaff, useReactivateStaff, useSetStaffRole, useStaffList } from "@/hooks/admin/use-staff"
import { formatActivityDate } from "@/lib/format"
import type { StaffMember } from "@/types/admin/staff"
import AddStaffDialog from "./add-staff-dialog"
import { ROLE_INFO, StaffRoleBadge } from "./staff-role"

const fullName = (member: StaffMember) => `${member.first_name} ${member.last_name}`.trim() || member.email

const DeactivateDialog = ({ member, onOpenChange }: { member: StaffMember | null, onOpenChange: (open: boolean) => void }) => {
  const deactivate = useDeactivateStaff()
  return (
    <Dialog open={member !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deactivate {member ? fullName(member) : ""}?</DialogTitle>
          <DialogDescription>
            They&apos;re signed out and can&apos;t sign in to the admin console. What they did stays on record, and you can reactivate them any time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deactivate.isPending}>
            Keep access
          </Button>
          <SubmitButton
            type="button"
            size="default"
            variant="destructive"
            pending={deactivate.isPending}
            pendingText="Deactivating…"
            onClick={() => member && deactivate.mutate(member.id, { onSuccess: () => onOpenChange(false) })}
          >
            Deactivate
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const MemberActions = ({ member, onDeactivate }: { member: StaffMember, onDeactivate: () => void }) => {
  const setRole = useSetStaffRole()
  const reactivate = useReactivateStaff()
  const other = member.role === "ADMIN" ? "SUPPORT" : "ADMIN"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${fullName(member)}`} />}>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {member.is_active ? (
          <>
            <DropdownMenuItem disabled={setRole.isPending} onClick={() => setRole.mutate({ id: member.id, role: other })}>
              Make {ROLE_INFO[other].label}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDeactivate}>
              Deactivate
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem disabled={reactivate.isPending} onClick={() => reactivate.mutate(member.id)}>
            Reactivate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Everyone with access to the admin console; admins add people, change roles and remove access */
const StaffPanel = ({ isAdmin }: { isAdmin: boolean }) => {
  const { data = [], isPending } = useStaffList()
  const [adding, setAdding] = useState(false)
  const [deactivating, setDeactivating] = useState<StaffMember | null>(null)

  return (
    <SectionCard
      title="Staff"
      description={isAdmin ? "Who can use the admin console, and what they can do." : "Who can use the admin console. Only admins can add or change staff."}
      action={
        isAdmin && (
          <Button size="sm" onClick={() => setAdding(true)}>
            <UserPlus data-icon="inline-start" />
            Add staff
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-5">
        <dl className="grid gap-3 sm:grid-cols-2">
          {(["ADMIN", "SUPPORT"] as const).map((role) => (
            <div key={role} className="flex flex-col gap-1 rounded-xl bg-muted/60 px-4 py-3">
              <dt><StaffRoleBadge role={role} /></dt>
              <dd className="text-xs text-hw-grey-700">{ROLE_INFO[role].description}</dd>
            </div>
          ))}
        </dl>

        {isPending ? (
          <ListSkeleton rows={3} />
        ) : (
          <ul className="flex flex-col divide-y divide-hw-border">
            {data.map((member) => (
              <li key={member.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <UseAvatar src={member.profile_image ?? ""} name={fullName(member)} aspectRatio="size-10" className="text-sm" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-hw-grey-900">
                    <span className="truncate">{fullName(member)}</span>
                    {member.is_you && <span className="text-xs font-normal text-hw-grey-500">(you)</span>}
                    <StaffRoleBadge role={member.role} />
                    {!member.is_active && <Badge variant="secondary">Deactivated</Badge>}
                  </span>
                  <span className="truncate text-xs text-hw-grey-500">
                    {member.email} · {member.last_login ? `last signed in ${formatActivityDate(member.last_login)}` : "hasn't signed in yet"}
                  </span>
                </div>
                {isAdmin && !member.is_you && <MemberActions member={member} onDeactivate={() => setDeactivating(member)} />}
              </li>
            ))}
          </ul>
        )}
      </div>
      <AddStaffDialog open={adding} onOpenChange={setAdding} />
      <DeactivateDialog member={deactivating} onOpenChange={(open) => !open && setDeactivating(null)} />
    </SectionCard>
  )
}

export default StaffPanel
