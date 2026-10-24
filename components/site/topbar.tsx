"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react"
import { siteLogo } from "@/assets/site"
import { CATEGORY_LINKS } from "@/modules/site/categories-details/data"
import { DropdownButton, DropdownRegister } from "./dropdown"
import { DialogRegister } from "./dialog-register"
import { LoginFormField, RegisterFormField } from "./form/field-form"

const links = [
  { title: "About Us", route: "/about-us" },
  { title: "Contact Us", route: "/contact" },
  { title: "FAQs", route: "/faq" },
]

export const TopBar = () => {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDialog, setActiveDialog] = useState<string|null>(null)
  const [current, setCurrent] = useState<string>("")
  

  const handleDialog = (val:string, mode:string) => {
    setActiveDialog(val)
    setCurrent(mode)
  }
  // category detail pages have no dark hero behind the bar, so it starts solid
  const isSolid = pathname.startsWith("/categories/")
  const isCategories = pathname.startsWith("/categories")

  useEffect(() => {
    const handleScroll = () => {
      // Compares scroll position to the full viewport height
      setIsScrolled(window.scrollY >= window.innerHeight)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeDrawer = () => setDrawerOpen(false)

  const desktopLinkClass = (active: boolean) =>
    active ? "text-secondary-orange font-bold" : ""

  return (
    <>
      <header id="topbar" className={`fixed top-0 backdrop-blur-[6px] w-screen max-w-[1920px] py-3 px-4 sm:px-16 xl:px-28 z-20 shadow-md ${isScrolled ? "bg-secondary-blue" : isSolid ? "bg-primary-white" : ""}`}>
        <nav className="flex flex-row w-full items-center justify-between">
          <Link href="/" className="outline-0">
            <Image src={siteLogo} draggable={false} priority className="h-10 w-auto" alt="Logo" />
          </Link>
          {/* Desktop nav */}
          <div className={`hidden lg:flex items-center text-sm font-medium gap-8 ${isSolid && !isScrolled ? "text-gray-900" : "text-primary-white"}`}>
            <Link href="/" className={desktopLinkClass(pathname === "/")}>Home</Link>
            <Link href="/categories" className={`flex items-center gap-1 ${desktopLinkClass(isCategories)}`}>
              <span>Categories</span>
            </Link>
            {links.map((link) =>
              <Link key={link.route} href={link.route} className={desktopLinkClass(pathname === link.route)}>{link.title}</Link>
            )}
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <DropdownRegister
              action="login"
              content={["As a Professional", "As a User"]}
              button={<DropdownButton title="Login" className="text-hw-base-white bg-transparent " />}
              className="min-w-38"
              // format action & content[x]
              onclick={(val, mode)=> handleDialog(val, mode)}
            />
            <DropdownRegister
              action="register"
              content={["Become a Professional", "Become a User"]}
              button={<DropdownButton title="Sign up" className="text-hw-grey-text-900" />}
              // format action & content[x]
              onclick={(val, mode)=> handleDialog(val, mode)}
            />
          </div>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className={`flex lg:hidden ml-2 ${isScrolled ? "text-primary-white" : "text-primary-text"}`}
          >
            <Menu />
          </button>
        </nav>
      </header>

      {/* Dialog Login */}
      <DialogRegister
        title={"Welcome Back"}
        desc={"Enter your email and password to access your account"}
        open={activeDialog === "login"}
        onOpenChange={(isOpen) => setActiveDialog(isOpen ? "login" : null)}
        content={<LoginFormField onclick={(val, mode)=> handleDialog(val, mode)} />}
      />

      {/* Dialog Register */}
      <DialogRegister
        title={`Join As A ${current==="Become a User"? 'User': 'Professional'}`}
        desc={`Registration for ${current==="Become a User"? 'Customer': 'Artisan'}`}
        open={activeDialog === "register"}
        onOpenChange={(isOpen) => setActiveDialog(isOpen ? "register" : null)}
        content={<RegisterFormField />}
      />

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={closeDrawer} />
          <div className="relative h-full w-fit min-w-70 flex flex-col gap-2 bg-primary-white shadow-xl overflow-y-auto">
            <div className="flex justify-between items-center p-4 bg-secondary-blue">
              <Link href="/" onClick={closeDrawer}>
                <Image src={siteLogo} className="h-10 w-auto" alt="Logo" />
              </Link>
              <button
                onClick={closeDrawer}
                aria-label="Close menu"
                className="text-primary-white cursor-pointer">
                <X />
              </button>
            </div>
            <ul className="flex flex-col">
              <li>
                <Link
                  href="/"
                  onClick={closeDrawer}
                  className={`flex px-4 py-2 ${pathname === "/" ? "text-secondary-orange" : "text-primary-text"}`}
                >
                  Home
                </Link>
              </li>

              <li>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className={`flex justify-between items-center w-full px-4 py-2 cursor-pointer text-left ${isCategories ? "text-secondary-orange" : "text-primary-text"}`}
                >
                  <span>Categories</span>
                  {servicesOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
              </li>

              {servicesOpen && (
                <ul>
                  {CATEGORY_LINKS.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/categories/${service.id}`}
                        onClick={closeDrawer}
                        className="flex pl-8 py-2 text-[0.9rem] text-primary-text"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {links.map((item) => (
                <li key={item.route}>
                  <Link
                    href={item.route}
                    onClick={closeDrawer}
                    className={`flex px-4 py-2 ${pathname === item.route ? "text-secondary-orange" : "text-primary-text"}`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
