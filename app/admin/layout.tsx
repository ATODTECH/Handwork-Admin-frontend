import { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin - HandworkExpert", template: "%s" },
  robots: { index: false, follow: false },
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
      <div className="scrollbar-thin scrollbar-thumb-gray-200 h-screen bg-[#FFFFFF]">
        {children}
      </div>
    </div>
  )
}

export default AdminLayout
