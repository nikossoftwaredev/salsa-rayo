"use client";

import { useTranslations } from "next-intl";
import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  SPOTIFY_URL,
  YOUTUBE_URL,
} from "@/data/config";
import { FaFacebook, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import { SectionTitle } from "@/components/SectionTitle";

// CHANGE THE COLORS OF THE ICONS
const SOCIALS_INFO = [
  {
    url: INSTAGRAM_URL,
    icon: <FaInstagram size={25} />,
    color: "instagram",
  },
  {
    url: YOUTUBE_URL,
    icon: <FaYoutube size={25} />,
    color: "youtube",
  },
  {
    url: SPOTIFY_URL,
    icon: <FaSpotify size={25} />,
    color: "spotify",
  },
  {
    url: FACEBOOK_URL,
    icon: <FaFacebook size={25} />,
    color: "facebook",
  },
];

const SocialsSection = ({ isMobile = false }: { isMobile?: boolean }) => {
  const t = useTranslations('Socials');
  const getColorClasses = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "bg-pink-500/10 hover:bg-pink-500/20 text-pink-500";
      case "youtube":
        return "bg-red-500/10 hover:bg-red-500/20 text-red-500";
      case "spotify":
        return "bg-green-500/10 hover:bg-green-500/20 text-green-500";
      case "facebook":
        return "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500";
      default:
        return "bg-primary/10 hover:bg-primary/20 text-primary";
    }
  };

  return (
    <section id="socials">
      {!isMobile && <SectionTitle title={t('title')} isMainSection />}
      <span className="flex flex-row flex-wrap items-center justify-center gap-2">
        {SOCIALS_INFO.filter(({ url }) => url && url.trim() !== "").map(({ url, icon, color }) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center btn btn-square transition-all duration-300 hover:scale-110 hover:shadow-lg transform ${getColorClasses(
              color
            )}`}
          >
            {icon}
          </a>
        ))}
      </span>
    </section>
  );
};

export default SocialsSection;
