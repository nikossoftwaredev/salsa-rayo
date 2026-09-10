"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { SectionTitle } from "@/components/SectionTitle";
import { motion } from "framer-motion";
import { 
  GALLERY_IMAGES, 
  GALLERY_VIDEOS, 
  GALLERY_CATEGORIES,
  GalleryCategory,
  GalleryImage,
  GalleryVideo
} from "@/data/gallery";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MasonryGallery from "./MasonryGallery";
import MediaLightbox, { type LightboxMedia } from "@/components/MediaLightbox";

interface FilterTab {
  id: GalleryCategory;
  label: string;
  icon: React.ReactNode;
  color: string;
}

type GalleryItem = 
  | (GalleryImage & { type: "image" })
  | (GalleryVideo & { type: "video" });

interface GallerySectionProps {
  isFullPage?: boolean;
  initialCategory?: GalleryCategory;
}

const getFilterTabs = (): FilterTab[] =>
  Object.entries(GALLERY_CATEGORIES).map(([category, { label, icon, color }]) => ({
    id: category as GalleryCategory,
    label,
    icon,
    color,
  }));

const toLightboxMedia = (item: GalleryItem): LightboxMedia =>
  item.type === "video"
    ? { type: "video", youtubeId: item.youtubeId, title: item.title }
    : { type: "image", src: item.src, alt: item.alt };

const getGalleryItems = (isFullPage: boolean, category?: GalleryCategory): GalleryItem[] => {
  const images: GalleryItem[] = GALLERY_IMAGES.map(img => ({ ...img, type: "image" as const }));
  const videos: GalleryItem[] = GALLERY_VIDEOS.map(vid => ({ ...vid, type: "video" as const }));

  const allItems: GalleryItem[] = [];
  const maxLength = Math.max(images.length, videos.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < images.length) allItems.push(images[i]);
    if (i < videos.length) allItems.push(videos[i]);
  }

  if (!category) return allItems;

  const filteredItems = allItems.filter(item => item.category === category);
  return isFullPage ? filteredItems : filteredItems.slice(0, 4);
};

const GallerySection = ({
  isFullPage = false,
  initialCategory,
}: GallerySectionProps) => {
  const t = useTranslations('Gallery');
  const [activeFilter, setActiveFilter] = useState<GalleryCategory>(initialCategory || "photos");
  const [selectedMedia, setSelectedMedia] = useState<LightboxMedia | null>(null);
  const router = useRouter();

  const closeLightbox = useCallback(() => setSelectedMedia(null), []);

  const filterTabs = getFilterTabs();
  const filteredItems = getGalleryItems(isFullPage, activeFilter);
  
  // Get total items available for the current category
  const totalItemsInCategory = getGalleryItems(true, activeFilter).length;

  const handleSeeMore = () => {
    router.push(`/gallery?category=${activeFilter}`);
  };

  return (
    <section
      id="gallery"
      className="flex items-center justify-center flex-col space-y-8 relative scroll-mt-20"
    >
      {!isFullPage && <SectionTitle title={t('title')} isMainSection />}

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={twMerge(
              "flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer",
              "backdrop-blur-md border border-border/20",
              activeFilter === tab.id
                ? "bg-gradient-to-r from-primary to-brand-pink text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                : "bg-card/80 text-foreground/70 hover:text-foreground hover:scale-105 hover:shadow-md hover:border-primary/25 hover:bg-primary/5"
            )}
          >
            <span
              className={activeFilter === tab.id ? "text-primary-foreground" : tab.color}
            >
              {tab.icon}
            </span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Category Title */}
      <motion.div
        key={`title-${activeFilter}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-foreground/90">
          {filterTabs.find(tab => tab.id === activeFilter)?.label}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          {t(`descriptions.${activeFilter}` as `descriptions.${typeof activeFilter}`)}
        </p>
      </motion.div>

      {/* Masonry Gallery */}
        <div
          className={twMerge(
            "w-full px-4",
            isFullPage ? "max-w-7xl" : "max-w-6xl"
          )}
        >
          <MasonryGallery
            items={filteredItems}
            onItemClick={(item) => setSelectedMedia(toLightboxMedia(item as GalleryItem))}
          />
        </div>

      {/* See More Button - only on homepage and when there are more items available */}
      {!isFullPage && totalItemsInCategory > 4 && (
        <div className="mt-12">
          <Button
            variant="gradient"
            size="lg"
            onClick={handleSeeMore}
          >
            {t('seeMore')}
          </Button>
        </div>
      )}

      <MediaLightbox media={selectedMedia} onClose={closeLightbox} />
    </section>
  );
};

export default GallerySection;