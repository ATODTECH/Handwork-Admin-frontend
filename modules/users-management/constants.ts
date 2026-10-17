import { FilterOption } from "@/components/shared/filter-select";

export type UserColumnFilters = "email" | "name" | "role" | "phone"
export interface AllUserColumnFilters {
  filter?: "all" | UserColumnFilters
} 

export const COLUMN_FILTERS: readonly FilterOption<UserColumnFilters>[] = [
  { value: "email", label: "Email" },
  { value: "name", label: "Name" },
  { value: "role", label: "Role" },
  { value: "phone", label: "Phone NO." },
]


