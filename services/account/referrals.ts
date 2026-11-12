import { queryOptions } from "@tanstack/react-query"
import { accountHttp } from "@/lib/http/client"
import { queryKeys } from "@/lib/query/keys"
import type { MyReferrals } from "@/types/account/referrals"

export const referralsService = {
  /** The signed-in person's invite code (made on first visit), who signed up with it, and their rewards */
  mine: (signal?: AbortSignal) => accountHttp.get<MyReferrals>("/api/referrals/me", { signal }),
}

export const myReferralsQuery = () =>
  queryOptions({ queryKey: queryKeys.account.referrals(), queryFn: ({ signal }) => referralsService.mine(signal) })
