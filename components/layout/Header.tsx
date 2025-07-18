"use client";

import { headerLinks } from "@/data/config";
import Logo from "../Logo";
import SocialsSection from "@/components/sections/socials/SocialsSection";
import { MdMenu, MdClose } from "react-icons/md";

const Header = () => {
  const handleClose = () => {
    const checkbox = document.getElementById(
      "mobile-drawer"
    ) as HTMLInputElement | null;
    if (checkbox) checkbox.checked = false;
  };

  return (
    <header className="drawer fixed top-0 left-0 right-0 z-40">
      {/* Hidden checkbox to control the drawer */}
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

      {/* ---------- NAVBAR (drawer-content) ---------- */}
      <div className="drawer-content w-full">
        <nav className="h-[60px] w-full bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-full">
            {/* Logo */}

            <Logo />

            {/* Desktop Links */}
            <ul className="hidden md:flex items-center gap-8">
              {headerLinks.map((linkConfig) => (
                <li key={linkConfig.path}>
                  <a
                    href={linkConfig.path}
                    className="font-bold text-lg text-white hover:text-primary relative group transition-colors duration-200 cursor-pointer"
                  >
                    {linkConfig.text.en}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Burger button (mobile) */}
            <label
              htmlFor="mobile-drawer"
              className="btn btn-circle btn-ghost md:hidden text-white hover:bg-white/20"
              aria-label="Open menu"
            >
              <MdMenu size={24} />
            </label>
          </div>
        </nav>
      </div>

      {/* ---------- DRAWER SIDE (mobile menu) ---------- */}
      <div className="drawer-side md:hidden">
        {/* overlay closes drawer on click */}
        <label htmlFor="mobile-drawer" className="drawer-overlay"></label>

        {/* Menu content */}
        <div className="min-h-full w-full bg-base-100 flex flex-col">
          {/* Close button */}
          <div className="flex justify-end pt-4 pr-4">
            <label
              htmlFor="mobile-drawer"
              className="btn btn-circle btn-ghost text-primary hover:bg-primary/20"
              aria-label="Close menu"
            >
              <MdClose size={24} />
            </label>
          </div>

          {/* Links & socials */}
          <div className="flex flex-col items-center pt-12 px-6 space-y-8 flex-grow">
            <nav className="flex flex-col items-center space-y-6">
              {headerLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={handleClose}
                  className="text-2xl font-bold text-primary hover:text-accent transition-colors duration-300"
                >
                  {link.text.en}
                </a>
              ))}
            </nav>

            {/* Social icons */}
            <SocialsSection isMobile />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
