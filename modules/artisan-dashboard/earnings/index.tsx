"use client"

import { useState } from "react"
import { BadgeCheck, Clock, Landmark, PiggyBank, Wallet as WalletIcon, WalletCards } from "lucide-react"
import EmptyState from "@/components/account/empty-state"
import PageHeader from "@/components/account/page-header"
import QueryContent from "@/components/account/query-content"
import SectionCard from "@/components/account/section-card"
import StatCard from "@/components/account/stat-card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useWallet } from "@/hooks/account/use-wallet"
import { RELEASE_AFTER_HOURS } from "@/lib/bookings"
import { formatNairaAmount } from "@/lib/format"
import { maskedAccount } from "@/lib/wallet"
import type { Wallet } from "@/types/account/wallet"
import { BankAccountForm } from "../onboarding/payout-step"
import ActivityList from "./activity-list"
import WithdrawDialog from "./withdraw-dialog"

/** Why the Withdraw button is off, if it is */
const withdrawBlocker = (wallet: Wallet) => {
  if (!wallet.bank) return "Add a bank account to withdraw."
  if (wallet.has_open_withdrawal) return "You have a withdrawal in progress."
  if (Number(wallet.available) < Number(wallet.min_withdrawal))
    return `You can withdraw once you have ${formatNairaAmount(wallet.min_withdrawal)}.`
  return null
}

const BankAccountCard = ({ wallet, onChange }: { wallet: Wallet, onChange: () => void }) => (
  <SectionCard
    title="Payout account"
    description="Withdrawals are sent here."
    action={
      <Button variant="outline" size="sm" onClick={onChange}>
        {wallet.bank ? "Change" : "Add"}
      </Button>
    }
  >
    {wallet.bank ? (
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-hw-secondary">
          <Landmark className="size-5" />
        </span>
        <div className="flex min-w-0 flex-col gap-1 text-sm">
          <span className="font-medium text-hw-grey-900">{wallet.bank.account_name}</span>
          <span className="text-hw-grey-500">{maskedAccount(wallet.bank.name, wallet.bank.account_number)}</span>
          <span className="flex items-center gap-1 text-xs text-hw-grey-500">
            {wallet.bank.verified ? (
              <>
                <BadgeCheck className="size-3.5 text-hw-text-green-solid" />
                Confirmed with your bank
              </>
            ) : (
              "We'll confirm it with your bank when you first withdraw."
            )}
          </span>
        </div>
      </div>
    ) : (
      <p className="text-sm text-hw-grey-500">You haven&apos;t added a bank account yet.</p>
    )}
  </SectionCard>
)

/** What the artisan has earned, what's on the way, and withdrawing it to their bank */
const ArtisanEarnings = () => {
  const { data: wallet, isPending, isError, refetch } = useWallet()
  const [dialog, setDialog] = useState<"withdraw" | "bank" | null>(null)
  const blocker = wallet ? withdrawBlocker(wallet) : null
  const closeDialog = (open: boolean) => !open && setDialog(null)

  return (
    <>
      <PageHeader
        title="Earnings"
        description="Your share of every confirmed job, and withdrawals to your bank."
        actions={
          <Button onClick={() => setDialog("withdraw")} disabled={!wallet || !!blocker} title={blocker ?? undefined}>
            <WalletCards data-icon="inline-start" />
            Withdraw
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Available"
          value={wallet && formatNairaAmount(wallet.available)}
          hint={blocker ?? "Ready to withdraw"}
          icon={WalletIcon}
          tone="success"
          loading={isPending}
        />
        <StatCard
          label="On the way"
          value={wallet && formatNairaAmount(wallet.on_the_way)}
          hint={`Paid by customers; yours once they confirm, or ${RELEASE_AFTER_HOURS} hours after you finish`}
          icon={Clock}
          tone="info"
          loading={isPending}
        />
        <StatCard
          label="Total earned"
          value={wallet && formatNairaAmount(wallet.total_earned)}
          hint="After our 10% fee"
          icon={PiggyBank}
          tone="brand"
          loading={isPending}
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <SectionCard title="Activity" description="Money in from jobs, and out to your bank." className="lg:col-span-2">
          <QueryContent
            isPending={isPending}
            isError={isError}
            onRetry={refetch}
            isEmpty={!wallet?.activity.length}
            empty={
              <EmptyState
                icon={WalletIcon}
                title="No earnings yet"
                description="When a customer confirms a job is done, your share appears here."
              />
            }
          >
            <ActivityList activity={wallet?.activity ?? []} />
          </QueryContent>
        </SectionCard>
        {wallet && <BankAccountCard wallet={wallet} onChange={() => setDialog("bank")} />}
      </div>

      {wallet?.bank && (
        <WithdrawDialog
          open={dialog === "withdraw"}
          onOpenChange={closeDialog}
          available={Number(wallet.available)}
          minimum={Number(wallet.min_withdrawal)}
          bank={wallet.bank}
        />
      )}
      <Dialog open={dialog === "bank"} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{wallet?.bank ? "Change payout account" : "Add payout account"}</DialogTitle>
            <DialogDescription>We check the account with your bank before saving it.</DialogDescription>
          </DialogHeader>
          <BankAccountForm
            bankId={wallet?.bank?.id}
            submitLabel="Save account"
            onSaved={() => setDialog(null)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ArtisanEarnings
