import { ADDRESS, MAIL, PHONE } from "../data/config";
import {
  MdMailOutline,
  MdOutlineCalendarToday,
  MdOutlinePhone,
  MdLocationPin,
  MdAccessTime,
} from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import AppLink from "./AppLink";
import SocialsSection from "./sections/socials/SocialsSection";

const footerSections = [
  {
    title: "Schedule",
    subtitles: [
      {
        icon: <MdOutlineCalendarToday />,
        value: "Monday - Thursday",
        type: "text",
      },
      { icon: <MdAccessTime />, value: "17:00 - 23:00", type: "text" },
    ],
  },
  {
    title: "Contact Info",
    subtitles: [
      { icon: <MdLocationPin />, value: ADDRESS, type: "text" },
      { icon: <MdOutlinePhone />, value: PHONE, type: "tel" },
      { icon: <MdMailOutline />, value: MAIL, type: "email" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative w-full bg-gradient-to-br from-base-300 to-base-200 border-t border-primary/20">
      <div className="flex items-center flex-col py-16 px-8 w-full font-sans">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 pb-12 gap-12 grid-cols-1 max-w-6xl w-full">
          {/* Brand Section */}
          <section className="text-left">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 ">
              Salsa Rayo
            </h3>
            <p className="text-base-content/80 mb-6 leading-relaxed">
              Your gateway to the magical world of social dancing! Join our
              passionate community and discover the joy of salsa.
            </p>
            <div className="flex justify-start">
              <SocialsSection isMobile />
            </div>
          </section>

          {/* Footer Sections */}
          {footerSections.map((footerSection) => (
            <section key={footerSection.title} className="text-left">
              <h4 className="text-2xl pb-4 font-bold text-primary">
                {footerSection.title}
              </h4>
              <div className="space-y-3">
                {footerSection.subtitles.map((subtitle) => (
                  <div
                    className="text-base flex items-center justify-start gap-3 text-base-content/70"
                    key={subtitle.value}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 text-accent">
                      {subtitle.icon}
                    </div>
                    {subtitle.type === "tel" ? (
                      <a
                        href={`tel:${subtitle.value}`}
                        className="hover:text-accent transition-colors duration-300"
                      >
                        {subtitle.value}
                      </a>
                    ) : subtitle.type === "email" ? (
                      <a
                        href={`mailto:${subtitle.value}`}
                        className="hover:text-accent transition-colors duration-300"
                      >
                        {subtitle.value}
                      </a>
                    ) : (
                      <span>{subtitle.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8"></div>

        {/* Copyright Section */}
        <section className="text-center text-base-content/60">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm">
            <span>
              © Copyright {new Date().getFullYear()} Salsa Rayo Dance School
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <FaHeart className="text-red-500" size={12} /> by
              <AppLink
                className="text-primary hover:text-accent transition-colors duration-300 font-medium"
                href="https://www.linkedin.com/in/nikosdim97/"
              >
                Nikos Dimitrakopoulos
              </AppLink>
            </span>
          </div>

          <div className="mt-4 text-xs text-base-content/40 animate-pulse">
            Keep dancing, keep dreaming!
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
