type badges = "Pending" | "In Review"

interface GridCardProps {
  revenue: number[];
  users: number[];
  artisans: number[];
  booking: number[];
  pending: number[];
}

interface GridRowCardProps {
  initials?: React.ReactNode;
  details: string[];
  tone: string;
  action: string;
  date: string;
  onClick: (val: string) => void;
}

interface ARTISANProps {
  id: number;
  name: string;
  location: string;
  role: string;
  createdAt: string;
}

interface DISPUTESProps {
  code: string;
  customer: string;
  artisan: string;
  role: string;
  dispute: string;
  solution: badges;
  timeStamp: string;
}