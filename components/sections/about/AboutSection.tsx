/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@/components/Card";
import { FC } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { YOUTUBE_VIDEOS } from "@/data/config";
import YoutubeIFrame from "./YoutubeIFrame";

const AboutCard: FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <Card className="grid grid-cols-1 lg:grid-cols-2 justify-center md:w-3/4 p-4 leading-8 text-lg font-medium">
    {children}
    <p></p>
    <a
      className="ml-auto btn btn-outline"
      href={href}
      target={href.startsWith("/") ? "_self" : "_blank"}
      rel="noreferrer"
    >
      ΠΕΡΙΣΣΟΤΕΡΑ
    </a>
  </Card>
);

const AboutSection: FC<{ [key: string]: any }> = () => (
  <>
    <SectionTitle title="ABOUT US" isMainSection />
    <section
      id="about"
      className="w-full flex flex-col items-center justify-center gap-4"
    >
      <AboutCard href="/resume">
        <figure className="flex flex-col items-center justify-center">
          <img
            src="/images/instructor-anna.png"
            alt="anna-lontou"
            className="h-[300px] w-[300px] rounded-xl object-cover"
            loading="lazy"
          />
        </figure>
        <div className="p-3">
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam
            expedita illo veritatis placeat corrupti rem asperiores totam
            doloremque sequi! Nostrum necessitatibus aspernatur excepturi
            <br />
            Nullam nec Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Ipsam expedita illo veritatis placeat corrupti rem asperiores totam
            doloremque sequi! Nostrum necessitatibus aspernatur excepturi
            consectetur reprehenderit illo velit repudiandae ullam suscipit.
          </div>
        </div>
      </AboutCard>
      <SectionTitle title="MEDIA" isMainSection />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {YOUTUBE_VIDEOS.map((video_id) => (
          <YoutubeIFrame key={video_id} video_id={video_id} />
        ))}
      </div>
    </section>
  </>
);

export default AboutSection;
