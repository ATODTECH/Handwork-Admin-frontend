
type Role = "user" | "artisan";

interface Users {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone: string;
  joinedAt: string;
}
