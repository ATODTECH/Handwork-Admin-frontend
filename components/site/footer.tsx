import Image from "next/image"
import Link from "next/link"
import Policy from "./legal/privacy-policy"
import TermsOfUse from "./legal/terms-of-use"

const footerLinks = [
  {
    title: "Categories",
    item: [
      { title: "Fashion and Beauty", url: "/categories/fashion" },
      { title: "Automotive", url: "/categories/automotive" },
      { title: "Export Services", url: "/categories/export" },
      { title: "Agriculture", url: "/categories/agriculture" },
      { title: "Logistics and warehousing", url: "/categories/logistics" },
    ],
  },
  {
    title: "Quick Links",
    item: [
      { title: "About Us", url: "/about-us" },
      { title: "Contact Us", url: "/contact" },
      { title: "Artisan's Attic Reports", url: "/contact" },
      { title: "FAQ", url: "/faq" },
    ],
  },
  {
    title: "Contact Us",
    item: [
      { title: "About Us", url: "/about-us" },
      { title: "Contact", url: "/contact" },
      { title: "Artisan's Attic Reports", url: "/contact" },
    ],
  },
]

const socialLinks = [
  { icon: "/icons/facebook.png", url: "https://facebook.com", alt: "Facebook" },
  { icon: "/icons/telegram.png", url: "https://t.me", alt: "Telegram" },
  { icon: "/icons/instagram.png", url: "https://instagram.com", alt: "Instagram" },
  { icon: "/icons/youtube.png", url: "https://youtube.com", alt: "YouTube" },
]

export const Footer = () => {
  const phoneNumber = '2347072814869'
  const message = encodeURIComponent('hello! *HandworkExpert*, I need your help');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <footer className="flex flex-col relative justify-center w-full px-4 py-10 p-16 sm:px-16 xl:px-28 bg-secondary-blue text-hw-base-white">
      <div className="border-b-[.5px] sm:border-b-[1.34px] border-b-[#7B7E86] w-full mb-4">
        <div className="grid grid-cols-2 md:flex gap-4 lg:gap-8 pb-16 justify-between w-full lg:max-w-[80%] text-[12px]">
          {footerLinks.map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <h5 className="font-bold text-[1rem] sm:text-xl mb-4">{item.title}</h5>
              {item.item.map(val => (
                <Link key={val.title} href={val.url} className="text-[.75rem] sm:text-sm hover:text-hw-primary">{val.title}</Link>
              ))}
            </div>
          ))}
          <div className="flex flex-col">
            <h5 className="font-bold text-[1rem] sm:text-xl mb-4">Social Links</h5>
            <div className="flex gap-2">
              {socialLinks.map(item => (
                <a key={item.alt} href={item.url} target="_blank" rel="noopener noreferrer" className="w-fit rounded-md hover:text-hw-primary">
                  <Image src={item.icon} draggable={false} height={24} width={24} alt={item.alt} className="h-5 sm:h-6 w-auto cursor-pointer" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-5 w-full lg:pr-25 text-[.75rem] sm:text-sm">
        <span>© 2023 All Rights Reserved</span>
        <p className="flex gap-4">
          <Link href="/policy">Privacy Policy</Link>
          <Link href="/terms">Terms and conditions</Link>
        </p>
      </div>
      <Link 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="want supports?"
        className="flex fixed bottom-5 right-3 z-50 bg-hw-base-white rounded-lg p-1 shadow">
          <Image src={"/icons/whatsapp.png"} alt="whatsapp" draggable={false} height={24} width={24} className="h-8 sm:h-10 w-auto cursor-pointer" />
      </Link>
    </footer>
  )
}
