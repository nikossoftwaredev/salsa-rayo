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
import Logo from "./Logo";
import { CircleIcon } from "./CircleIcon";

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
    <footer className="relative w-full bg-gradient-to-br from-base-300 via-base-200 to-base-300 border-t-2 border-primary/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-3xl animate-float-medium"></div>
      </div>
      
      <div className="relative flex items-center flex-col py-20 px-8 w-full font-sans z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 pb-12 gap-12 grid-cols-1 max-w-6xl w-full">
          {/* Brand Section */}
          <section className="text-left">
            <div className="mb-6">
              <Logo size="lg" />
            </div>
            <p className="text-base-content/80 mb-6 leading-relaxed text-lg">
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
              <h4 className="text-2xl pb-6 font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {footerSection.title}
              </h4>
              <div className="space-y-3">
                {footerSection.subtitles.map((subtitle) => (
                  <div
                    className="text-base flex items-center justify-start gap-3 text-base-content/70 group hover:text-base-content transition-colors duration-300"
                    key={subtitle.value}
                  >
                    <CircleIcon 
                      icon={subtitle.icon}
                      color="#18A07B"
                      size={48}
                    />
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

        {/* Animated Divider */}
        <div className="w-full max-w-6xl mb-8 relative">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-pulse"></div>
        </div>

        {/* Copyright Section */}
        <section className="text-center text-base-content/60">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm">
            <span>
              © Copyright {new Date().getFullYear()} Salsa Rayo Dance School
            </span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-2">
              Made with 
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20">
                <FaHeart className="text-red-500" size={12} />
              </span>
              by
              <AppLink
                className="text-primary hover:text-accent transition-colors duration-300 font-medium"
                href="https://www.linkedin.com/in/nikosdim97/"
              >
                Nikos Dimitrakopoulos
              </AppLink>
            </span>
          </div>

          <div className="mt-6 relative">
            <p className="text-sm text-base-content/50 font-light tracking-widest uppercase">
              Keep dancing, keep dreaming!
            </p>
            <div className="mt-2 flex justify-center gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
              <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '200ms'}}></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '400ms'}}></span>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
