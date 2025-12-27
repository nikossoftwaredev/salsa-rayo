"use client";

import { useTranslations } from "next-intl";
import { MAP_IFRAME, NAVIGATION, ADDRESS } from "@/data/config";
import { SectionTitle } from "@/components/SectionTitle";
import { MdDirections, MdLocationPin } from "react-icons/md";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const MapSection = () => {
  const t = useTranslations('Map');
  return (
    <section id="map" className="flex items-center justify-center flex-col scroll-mt-20">
      <SectionTitle title={t('title')} isMainSection />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[600px]"
      >
        <div className="bg-card rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
          {/* Address Bar */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                <MdLocationPin className="text-primary" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
                <p className="text-base font-medium text-foreground/90">{ADDRESS}</p>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-[400px] overflow-hidden">
            <iframe
              title={t('mapTitle')}
              src={MAP_IFRAME}
              className="border-hidden invert-[90%] hue-rotate-180 w-full h-full block"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Overlay gradient for better integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent pointer-events-none" />

            {/* Directions Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-4 right-4 z-10"
            >
              <Button
                variant="gradient"
                onClick={() => window.open(NAVIGATION, '_blank', 'noopener,noreferrer')}
                className="font-medium"
              >
                <MdDirections size={20} />
                {t('getDirections')}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default MapSection;
