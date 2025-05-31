"use client";

import { headerLinks } from "@/data/config";
import MobileHeader from "./MobileHeader";
import Logo from "../Logo";

const Header = () => {
  const languageId = "en";
  return (
    <header className="w-full z-[999] absolute max-h-[100px] bg-transparent">
      <nav className="w-full text-primary backdrop-blur-lg ">
        <span className="md:hidden">
          <MobileHeader />
        </span>
        <span className="hidden md:block">
          <ul className="p-4 w-full flex flex-wrap  md:flex-row justify-between items-center mr-1">
            <span className="flex gap-6 justify-center items-center w-full">
              <Logo />
              {headerLinks.map((linkConfig) => {
                return (
                  <li key={linkConfig.path}>
                    <a
                      href={linkConfig.path}
                      className={`font-bold text-lg relative group transition-colors duration-200`}
                    >
                      {linkConfig.text[languageId]}
                      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                );
              })}
            </span>
          </ul>
        </span>
      </nav>
    </header>
  );
};

export default Header;
