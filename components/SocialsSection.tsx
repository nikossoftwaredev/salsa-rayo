import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  SPOTIFY_URL,
  YOUTUBE_URL,
} from "@/data/config";
import { FaFacebook, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import { SectionTitle } from "./SectionTitle";
import Card from "./Card";

// CHANGE THE COLORS OF THE ICONS
const SOCIALS_INFO = [
  {
    url: INSTAGRAM_URL,
    icon: <FaInstagram size={25} className="text-[#E1306C]" />,
  },
  {
    url: YOUTUBE_URL,
    icon: <FaYoutube size={25} className="text-[#FF0000]" />,
  },
  {
    url: SPOTIFY_URL,
    icon: <FaSpotify size={25} className="text-[#1DB954]" />,
  },
  {
    url: FACEBOOK_URL,
    icon: <FaFacebook size={25} className="text-[#1877F2]" />,
  },
];

const SocialsSection = () => {
  return (
    <section id="socials">
      <SectionTitle title="Socials" />
      <Card className="w-full">
        <div className="card-body flex flex-row flex-wrap items-center justify-center gap-2">
          {SOCIALS_INFO.map(({ url, icon }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center btn btn-square bg-black"
            >
              {icon}
            </a>
          ))}
        </div>
      </Card>
    </section>
  );
};

export default SocialsSection;
