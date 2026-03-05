"use client";

import { useTranslations } from "next-intl";
import { MAIL, PHONE } from "../data/config";

import {
  MdMailOutline,
  MdOutlineCalendarToday,
  MdOutlinePhone,
  MdLocationPin,
  MdAccessTime,
} from "react-icons/md";
import AppLink from "./AppLink";
import SocialsSection from "./sections/socials/SocialsSection";
import Logo from "./Logo";
import { CircleIcon } from "./CircleIcon";

const renderSubtitleValue = (value: string, type: string) => {
  if (type === "tel")
    return (
      <a
        href={`tel:${value}`}
        className="hover:text-brand-pink transition-colors duration-300"
      >
        {value}
      </a>
    );

  if (type === "email")
    return (
      <a
        href={`mailto:${value}`}
        className="hover:text-brand-pink transition-colors duration-300"
      >
        {value}
      </a>
    );

  return <span>{value}</span>;
};

const Footer = () => {
  const t = useTranslations("Footer");

  const footerSections = [
    {
      title: t("schedule"),
      subtitles: [
        {
          icon: <MdOutlineCalendarToday size={22} />,
          value: t("workDays"),
          type: "text",
        },
        { icon: <MdAccessTime size={22} />, value: t("workHours"), type: "text" },
      ],
    },
    {
      title: t("contactInfo"),
      subtitles: [
        { icon: <MdLocationPin size={22} />, value: t("address"), type: "text" },
        { icon: <MdOutlinePhone size={22} />, value: PHONE, type: "tel" },
        { icon: <MdMailOutline size={22} />, value: MAIL, type: "email" },
      ],
    },
  ];

  return (
    <footer className="relative w-full bg-card/90 backdrop-blur-sm border-t border-border/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-brand-pink/20 to-transparent rounded-full blur-3xl animate-float-medium"></div>
      </div>

      <div className="relative flex items-center flex-col py-20 px-8 w-full font-sans z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 pb-12 gap-12 grid-cols-1 max-w-6xl w-full">
          {/* Brand Section */}
          <section className="text-left">
            <div className="mb-6">
              <Logo size="lg" />
            </div>
            <p className="text-foreground/80 mb-6 leading-relaxed text-lg">
              {t("description")}
            </p>
            <div className="flex justify-start">
              <SocialsSection isMobile />
            </div>
          </section>

          {/* Footer Sections */}
          {footerSections.map((footerSection) => (
            <section key={footerSection.title} className="text-left">
              <h4 className="text-2xl pb-6 font-bold bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
                {footerSection.title}
              </h4>
              <div className="space-y-3">
                {footerSection.subtitles.map((subtitle) => (
                  <div
                    className="text-base flex items-center justify-start gap-3 text-foreground/70 group hover:text-foreground transition-colors duration-300"
                    key={subtitle.value}
                  >
                    <CircleIcon
                      icon={subtitle.icon}
                      color="#18A07B"
                      size={48}
                    />
                    {renderSubtitleValue(subtitle.value, subtitle.type)}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Animated Divider */}
        <div className="w-full max-w-6xl mb-8 relative">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-brand-pink/50 to-transparent animate-pulse"></div>
        </div>

        {/* Copyright Section */}
        <section className="text-center text-foreground/60">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm">
            <span>{t("copyright", { year: new Date().getFullYear() })}</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-2">
              {t("madeBy")}
              <AppLink
                className="text-primary hover:text-brand-pink transition-colors duration-300 font-medium"
                href="https://hexaigon.gr"
              >
                hexaigon.gr
              </AppLink>
            </span>
          </div>

          <div className="mt-6 relative">
            <p className="text-sm text-foreground/50 font-light tracking-widest uppercase">
              {t("slogan")}
            </p>
            <div className="mt-2 flex justify-center gap-1">
              <span
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-2 h-2 bg-brand-pink rounded-full animate-bounce"
                style={{ animationDelay: "200ms" }}
              ></span>
              <span
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "400ms" }}
              ></span>
            </div>
          </div>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
