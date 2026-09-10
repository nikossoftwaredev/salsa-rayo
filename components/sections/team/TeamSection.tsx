"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SectionTitle } from "@/components/SectionTitle";
import MediaLightbox, { type LightboxMedia } from "@/components/MediaLightbox";
import { AboutCard } from "@/components/sections/about/AboutSection";
import { type FounderKey } from "@/data/team";

interface TeamMember {
  id: string;
  name: string;
  image: string;
  bio: string | null;
  founderKey: FounderKey | null;
}

interface TeamSectionProps {
  members: TeamMember[];
}

const TeamSection = ({ members }: TeamSectionProps) => {
  const t = useTranslations("Team");
  const tAbout = useTranslations("About");
  const [selectedMedia, setSelectedMedia] = useState<LightboxMedia | null>(null);

  const closeLightbox = useCallback(() => setSelectedMedia(null), []);

  return (
    <section id="team" className="flex flex-col items-center scroll-mt-20">
      <SectionTitle title={t("title")} isMainSection />

      {/* flex-wrap + fixed card widths, so an incomplete last row stays centred */}
      <div className="w-full max-w-6xl flex flex-wrap justify-center gap-8">
        {members.map((member, index) => {
          // Founders reuse the localized, gendered titles from the About section
          const role = member.founderKey
            ? tAbout(`${member.founderKey}Title`)
            : t("teacher");

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc((100%-4rem)/3)] max-w-sm"
            >
              {/* py-0 gap-0 drops the Card's built-in padding so the photo sits
                  flush against the card's top edge */}
              <AboutCard className="py-0 gap-0 h-full">
                <button
                  type="button"
                  aria-label={member.name}
                  onClick={() =>
                    setSelectedMedia({
                      type: "image",
                      src: member.image,
                      alt: member.name,
                      caption: member.name,
                    })
                  }
                  className="group relative block w-full aspect-[4/5] overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    // Cards are capped by max-w-sm (384px) at every breakpoint
                    sizes="(min-width: 1024px) 362px, 384px"
                    loading="lazy"
                    className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                </button>

                <div className="p-5 space-y-1">
                  <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm font-medium text-primary">{role}</p>
                  {member.bio && (
                    <p className="pt-2 text-sm leading-relaxed text-foreground/75 line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                </div>
              </AboutCard>
            </motion.div>
          );
        })}
      </div>

      <MediaLightbox media={selectedMedia} onClose={closeLightbox} />
    </section>
  );
};

export default TeamSection;
