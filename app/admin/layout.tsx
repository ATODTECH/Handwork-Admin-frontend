import { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin - HandworkExpert", template: "%s" },
  robots: { index: false, follow: false },
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => <div className="font-sans">{children}</div>

export default AdminLayout
