import { FilterOption } from "@/components/shared/filter-select";

type RoleFilter = "all" | Role;
type DateFilter = "this-month" | "last-7-days" | "last-30-days" | "this-year" | "all-time";

export interface UsersFilters {
  role?: RoleFilter;
  date?: DateFilter;
}

export const ROLE_FILTERS: readonly FilterOption<Role>[] = [
  { label: "All Roles" },
  { value: "user", label: "User" },
  { value: "artisan", label: "Artisan" },
]

// export const DATE_FILTERS: readonly FilterOption<DateFilter>[] = () => { value: DateFilter; label: string }[] = [
//   { value: "this-month", label: "This Month" },
//   { value: "last-7-days", label: "Last 7 Days" },
//   { value: "last-30-days", label: "Last 30 Days" },
//   { value: "this-year", label: "This Year" },
//   { value: "all-time", label: "All Time" },
// ]
