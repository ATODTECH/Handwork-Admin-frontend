import { ChevronDown, Headphones, Shield } from "@/assets";
import { useDismiss } from "@/hooks/use-dismiss";
import { useMemo, useState } from "react";
import { toast } from "sonner";


type Role = "User" | "Artisan";

interface AppUser {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone: string;
  joinedAt: string; // ISO date, e.g. "2025-07-02"
}

type RoleFilter = "all" | Role;
type DateFilter = "this-month" | "last-7-days" | "last-30-days" | "this-year" | "all-time";
type SortKey = "name" | "role" | "email";
type SortDir = "asc" | "desc";

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All Roles" },
  { value: "User", label: "User" },
  { value: "Artisan", label: "Artisan" },
]

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "this-month", label: "This Month" },
  { value: "last-7-days", label: "Last 7 Days" },
  { value: "last-30-days", label: "Last 30 Days" },
  { value: "this-year", label: "This Year" },
  { value: "all-time", label: "All Time" },
]

// Dummy Data
const SAMPLE_USERS: AppUser[] = [
  { id:"1", name:"Lawal Halima", role:"User", email:"lawalhalima@gmail.com", phone:"08136401829", joinedAt:"2025-07-02"},
  { id:"2", name:"Chukwuemeka Eze", role:"Artisan", email:"c.eze.artisan@gmail.com", phone:"08022334455", joinedAt:"2025-07-03"},
  { id:"3", name:"Amina Bello", role:"User", email:"amina.bello@yahoo.com", phone:"07055678901", joinedAt:"2025-07-03"},
  { id:"4", name:"Tunde Fashola", role:"Artisan", email:"t.fashola@artisan.ng", phone:"08099887766", joinedAt:"2025-07-04"},
  { id:"5", name:"Ngozi Obi", role:"User", email:"ngozi.obi@gmail.com", phone:"08031122334", joinedAt:"2025-07-04"},
  { id:"6", name:"Samuel Adeyemi", role:"Artisan", email:"sam.adeyemi@artisan.ng", phone:"09012345678", joinedAt:"2025-07-05"},
  { id:"7", name:"Fatima Garba", role:"User", email:"fatima.garba@yahoo.com", phone:"08077665544", joinedAt:"2025-07-05"},
  { id:"8", name:"Babatunde Okafor", role:"Artisan", email:"b.okafor.craft@gmail.com", phone:"08154433221", joinedAt:"2025-07-06"},
]

// Filters
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

function matchesDateFilter(iso: string, filter: DateFilter, ref: Date): boolean {
  if (filter === "all-time") return true;
  const d = new Date(iso);
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const today = startOfDay(ref);

  switch (filter) {
    case "this-month":
      return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
    case "this-year":
      return d.getFullYear() === ref.getFullYear();
    case "last-7-days":
    case "last-30-days": {
      const days = filter === "last-7-days" ? 7 : 30;
      const from = new Date(today);
      from.setDate(from.getDate() - days);
      return d >= from && d <= ref;
    }
    default:
      return true;
  }
}

const SortIcon = ({ dir }: { dir: SortDir | null }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden className="h-4 w-4">
    <path
      d="M5 6.5l3-3 3 3"
      stroke={dir === "asc" ? "#1F2A7A" : "currentColor"}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 9.5l3 3 3-3"
      stroke={dir === "desc" ? "#1F2A7A" : "currentColor"}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface FilterDropdownProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

const FilterDropdown = <T extends string>({ label, value, options, onChange }: FilterDropdownProps<T>) => {
  const [open, setOpen] = useState(false);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  const current = options.find((o) => o.value === value)?.label ?? "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-500 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2A7A]/40"
      >
        {current}
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-20 mt-1 min-w-full whitespace-nowrap rounded-md border border-slate-200 bg-white py-1 shadow-lg"
        >
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                  o.value === value ? "font-medium text-[#1F2A7A]" : "text-slate-600"
                }`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface RowMenuProps {
  user: AppUser;
  onAction?: (action: "view" | "edit" | "suspend", user: AppUser) => void;
}

const RowMenu = ({ user, onAction }: RowMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));

  const items: { key: "view" | "edit" | "suspend"; label: string; danger?: boolean }[] = [
    { key: "view", label: "View profile" },
    { key: "edit", label: "Edit user" },
    { key: "suspend", label: "Suspend user", danger: true },
  ];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        aria-label={`Actions for ${user.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2A7A]/40"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-4 w-4">
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="10" cy="16" r="1.5" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-40 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.key}
              role="menuitem"
              type="button"
              onClick={() => {
                onAction?.(item.key, user);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                item.danger ? "text-red-600" : "text-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Main component --------------------------- */

interface RecentUsersTableProps {
  users?: AppUser[];
  /** Total registered users, shown in the footer. */
  totalUsers?: number;
  /** "Today" for the date filter. Defaults to the current date. */
  referenceDate?: Date;
  onViewAll?: () => void;
  onRowAction?: (action: "view" | "edit" | "suspend", user: AppUser) => void;
}


const RecentUsers = () => {
  const [data, setData] = useState(SAMPLE_USERS)
  const referenceDate = new Date("2025-07-06")
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("this-month");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null);

  const ref = useMemo(() => referenceDate ?? new Date(), [referenceDate]);

  const rows = useMemo(() => {
    const filtered = data.filter(
      (u) => (roleFilter === "all" || u.role === roleFilter) && matchesDateFilter(u.joinedAt, dateFilter, ref)
    );
    if (!sort) return filtered;
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => a[sort.key].localeCompare(b[sort.key]) * factor);
  }, [data, roleFilter, dateFilter, sort, ref]);

    // Click cycles: ascending -> descending -> unsorted
  const toggleSort = (key: SortKey) =>
    setSort((s) => {
      if (!s || s.key !== key) return { key, dir: "asc" };
      if (s.dir === "asc") return { key, dir: "desc" };
      return null;
    });

  const SortableTh = ({ k, label, className = "" }: { k: SortKey; label: string; className?: string }) => {
    const dir = sort?.key === k ? sort.dir : null;
    return (
      <th
        scope="col"
        aria-sort={dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none"}
        className={`px-4 py-4 font-normal ${className}`}
      >
        <button
          type="button"
          onClick={() => toggleSort(k)}
          className="flex w-full items-center justify-between gap-2 text-left hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2A7A]/40"
        >
          {label}
          <SortIcon dir={dir} />
        </button>
      </th>
    );
  };

  return (
    <>
      <div className="flex gap-6 items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className=" text-lg font-semibold text-hw-grey-text-900">Recent Users</h2>
          <h3 className=" text-xs font-normal text-[#6D7280]">Latest registrations across all roles</h3>
        </div>
        {/* filters */}
        <div className="flex items-center gap-2">
          <FilterDropdown label="Filter by role" value={roleFilter} options={ROLE_OPTIONS} onChange={setRoleFilter} />
          <FilterDropdown label="Filter by date" value={dateFilter} options={DATE_OPTIONS} onChange={setDateFilter} />
        </div>
      </div>
      
      {/* Card */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] table-fixed border-collapse text-sm">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[12%]" />
              <col className="w-[27%]" />
              <col className="w-[17%]" />
              <col className="w-[16%]" />
              <col className="w-[8%]" />
            </colgroup>

            <thead>
              <tr className="rounded-t-xl border-b border-slate-200 bg-slate-50/70 text-xs text-slate-500">
                <SortableTh k="name" label="Name" className="pl-5" />
                <SortableTh k="role" label="Role" />
                <SortableTh k="email" label="Email" />
                <th scope="col" className="px-4 py-4 font-normal">Phone No</th>
                <th scope="col" className="px-4 py-4 font-normal">Date Joined</th>
                <th scope="col" className="px-4 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-sm text-slate-500">
                    No users match these filters. Try a different role or date range.
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
                    <td className="truncate py-5 pl-5 pr-4 font-medium text-slate-900">{u.name}</td>
                    <td className="px-4 py-5 text-slate-500">{u.role}</td>
                    <td className="truncate px-4 py-5 text-slate-600">{u.email}</td>
                    <td className="px-4 py-5 text-slate-700 tabular-nums">{u.phone}</td>
                    <td className="px-4 py-5 text-slate-600 tabular-nums">{formatDate(u.joinedAt)}</td>
                    <td className="px-4 py-5 text-right">
                      <RowMenu user={u} onAction={(val)=> toast("coming soon!")} />
                      {/* <RowMenu user={u} onAction={onRowAction} /> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
          <p className="text-xs text-slate-500">
            Showing {rows.length} of {data.length} users
          </p>
          <button
            type="button"
            onClick={()=>""}
            // onClick={onViewAll} // routes
            className="rounded-md bg-[#1F2A7A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#182262] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F2A7A]/50 focus-visible:ring-offset-2"
          >
            View all users
          </button>
        </div>
      </div>
    </>
  )
}

export default RecentUsers