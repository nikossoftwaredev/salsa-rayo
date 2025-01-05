import { ADDRESS, MAIL, PHONE } from "../data/config";
import {
  MdMailOutline,
  MdOutlineCalendarToday,
  MdOutlinePhone,
  MdLocationPin,
  MdAccessTime,
} from "react-icons/md";
import AppLink from "./AppLink";

const footerSections = [
  {
    title: "Schedule",
    subtitles: [
      { icon: <MdOutlineCalendarToday />, value: "Monday - Thursday" },
      { icon: <MdAccessTime />, value: "17:00 - 23:00" },
    ],
  },
  {
    title: "Contact Info",
    subtitles: [
      { icon: <MdLocationPin />, value: ADDRESS },
      { icon: <MdOutlinePhone />, value: PHONE },
      { icon: <MdMailOutline />, value: MAIL },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="flex items-center flex-col py-10 bg-base-200 w-full">
      <div className="flex justify-center items-start gap-20 pb-5  sm:flex-col md:flex-row flex-wrap">
        {footerSections.map((footerSection) => (
          <section key={footerSection.title}>
            <h4 className="text-3xl pb-3 font-bold text-accent-focus">
              <span>{footerSection.title}</span>
            </h4>
            {footerSection.subtitles.map((subtitle) => (
              <div
                className="text-lg flex  items-center justify-start gap-2"
                key={subtitle.value}
              >
                {subtitle.icon} {subtitle.value}
              </div>
            ))}
          </section>
        ))}
      </div>
      <section className="text-center">
        © Copyright {new Date().getFullYear()}
        <br />
        Made by
        <AppLink
          className="text-primary"
          href="https://www.linkedin.com/in/nikosdim97/"
        >
          &nbsp; Nikos Dimitrakopoulos&nbsp;
        </AppLink>
      </section>
    </footer>
  );
};

export default Footer;
