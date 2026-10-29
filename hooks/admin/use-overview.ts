import { useQuery } from "@tanstack/react-query"
import { adminOverviewQuery } from "@/services/admin/overview"

export const useAdminOverview = () => useQuery(adminOverviewQuery())
