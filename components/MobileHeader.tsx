"use client";
import { headerLinks } from "@/data/config";
import { useEffect, useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import SocialsSection from "./SocialsSection";

const MobileHeader = () => {
  const [openModal, setOpenModal] = useState(false);
  const languageId = "en";

  useEffect(() => {
    if (openModal) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [openModal]);

  return (
    <>
      <div className="flex items-center justify-between p-2">
        <button className="btn btn-square btn-sm btn-ghost btn-secondary h-[30] flex justify-center mr-1 ml-auto">
          {openModal ? (
            <MdClose onClick={() => setOpenModal(false)} size={30} />
          ) : (
            <MdMenu onClick={() => setOpenModal(true)} size={30} />
          )}
        </button>
      </div>
      {openModal && (
        <div
          className="overscroll-none overflow-hidden p-3 
                    h-screen-small h-screen w-full max-h-screen 
                    max-w-none flex items-center flex-col justify-center
                    backdrop-blur-lg"
        >
          <span className="flex flex-col justify-center items-center gap-4 mb-10">
            {headerLinks.map((linkConfig) => {
              return (
                <span key={linkConfig.path}>
                  <a
                    onClick={() => setOpenModal(false)}
                    href={linkConfig.path}
                    className={`text-3xl text-primary font-extrabold uppercase hover:text-primary`}
                  >
                    {linkConfig.text[languageId]}
                  </a>
                </span>
              );
            })}
          </span>
          <SocialsSection isMobile />
        </div>
      )}
    </>
  );
};

export default MobileHeader;
