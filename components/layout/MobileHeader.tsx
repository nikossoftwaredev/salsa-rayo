"use client";
import { useState, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { headerLinks } from "@/data/config";
import SocialsSection from "@/components/sections/socials/SocialsSection";
import Logo from "@/components/Logo";

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Toggle Button - Stays in Header */}
      <div className="flex items-center justify-start h-full px-4">
        <button
          onClick={toggleMenu}
          className="btn btn-circle btn-ghost text-primary hover:bg-primary/20 transition-colors duration-300"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Content - Below Header */}
      {isMenuOpen && (
        <div className="fixed top-[60px] left-0 right-0 bottom-0 z-50 bg-white bg-opacity-100">
          <div className="flex flex-col items-center pt-20 px-6 space-y-8">
            {/* Navigation Links */}
            <nav className="flex flex-col items-center space-y-6">
              {headerLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={closeMenu}
                  className="text-2xl font-bold text-primary hover:text-accent transition-colors duration-300"
                >
                  {link.text.en}
                </a>
              ))}
            </nav>

            {/* Social Icons */}
            <div className="mt-8">
              <SocialsSection isMobile />
            </div>

            {/* Logo */}
            <div className="mt-8 flex justify-center">
              <Logo size="lg" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
