"use client";

import { useTranslations } from "next-intl";
import Card from "@/components/Card";
import { MAP_IFRAME, NAVIGATION, ADDRESS } from "@/data/config";
import { SectionTitle } from "@/components/SectionTitle";
import { MdDirections, MdLocationPin } from "react-icons/md";
import { motion } from "framer-motion";

const MapSection = () => {
  const t = useTranslations('Map');
  return (
    <section id="map" className="flex items-center justify-center flex-col">
      <SectionTitle title={t('title')} isMainSection />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[600px]"
      >
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
          {/* Address Bar */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                <MdLocationPin className="text-primary" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/60">{t('subtitle')}</p>
                <p className="text-base font-medium text-white/90">{ADDRESS}</p>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-[400px] overflow-hidden rounded-b-lg">
            <iframe
              title={t('mapTitle')}
              src={MAP_IFRAME}
              className="rounded-lg border-hidden invert-[90%] hue-rotate-180 w-full h-full"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Overlay gradient for better integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

            {/* Directions Button */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary absolute bottom-4 right-4 flex items-center gap-2 shadow-xl hover:shadow-2xl z-10 bg-gradient-to-r from-primary to-accent border-none"
              href={NAVIGATION}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MdDirections size={20} />
              {t('getDirections')}
            </motion.a>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};

export default MapSection;
