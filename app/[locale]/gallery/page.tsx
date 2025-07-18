"use client";

import GallerySection from "@/components/sections/gallery/GallerySection";
import BackgroundEffects from "@/components/BackgroundEffects";
import { motion } from "framer-motion";

export default function GalleryPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <BackgroundEffects />
      
      <div className="relative pt-20 pb-16 px-4 md:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center mb-4"
          >
            Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/70 text-center"
          >
            Explore our dance journey through photos and videos
          </motion.p>
        </div>

        {/* Gallery Section Component */}
        <GallerySection isFullPage />
      </div>
    </div>
  );
}