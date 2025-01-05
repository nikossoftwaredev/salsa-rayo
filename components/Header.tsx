"use client";

import { headerLinks } from "@/data/config";
import MobileHeader from "./MobileHeader";
import Logo from "./Logo";

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
                      className={`font-bold text-lg hover:text-primary`}
                    >
                      {linkConfig.text[languageId]}
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
