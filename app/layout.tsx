import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({ children }: 
{ children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="flex flex-col h-screen overflow-hidden">
        <div className="scrollbar-thin scrollbar-thumb-gray-200 h-screen overflow-auto bg-[#FFFFFF]">
          {children}
        </div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
