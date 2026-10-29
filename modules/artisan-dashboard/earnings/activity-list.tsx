import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { cn } from "cn"
import WithdrawalStatusBadge from "@/components/shared/withdrawal-status-badge"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { formatActivityDate, formatNairaAmount } from "@/lib/format"
import type { WalletActivity } from "@/types/account/wallet"

/** Money in from confirmed jobs and out to the bank, newest first */
const ActivityList = ({ activity }: { activity: WalletActivity[] }) => (
  <ItemGroup className="gap-3">
    {activity.map((item) => {
      const earning = item.kind === "earning"
      const Icon = earning ? ArrowDownLeft : ArrowUpRight
      return (
        <Item key={item.id} variant="outline" className="rounded-xl bg-white">
          <ItemMedia>
            <span className={cn("flex size-10 items-center justify-center rounded-xl", earning ? "bg-hw-bg-green text-hw-text-green-solid" : "bg-secondary text-hw-secondary")}>
              <Icon className="size-5" />
            </span>
          </ItemMedia>
          <ItemContent className="min-w-0 gap-1">
            <ItemTitle className="text-sm font-semibold text-hw-grey-900">{earning ? "Earnings" : "Withdrawal"}</ItemTitle>
            <ItemDescription className="text-xs">
              {item.description} · <time dateTime={item.date}>{formatActivityDate(item.date)}</time>
              {item.note && <span className="block text-destructive">{item.note}</span>}
            </ItemDescription>
          </ItemContent>
          <ItemActions className="flex-col items-end gap-1.5">
            <span className={cn("text-sm font-semibold tabular-nums", earning ? "text-hw-text-green-solid" : "text-hw-grey-900")}>
              {earning ? "+" : "−"}{formatNairaAmount(item.amount)}
            </span>
            {!earning && <WithdrawalStatusBadge status={item.status} />}
          </ItemActions>
        </Item>
      )
    })}
  </ItemGroup>
)

export default ActivityList
