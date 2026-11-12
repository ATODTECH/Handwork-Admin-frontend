import { useQuery } from "@tanstack/react-query"
import { myReferralsQuery } from "@/services/account/referrals"

export const useMyReferrals = () => useQuery(myReferralsQuery())
