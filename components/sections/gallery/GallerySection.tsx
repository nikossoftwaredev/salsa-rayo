"use client";

import { useState } from "react";
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
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import MasonryGallery from "./MasonryGallery";

type FilterType = GalleryCategory;

interface FilterTab {
  id: FilterType;
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

const getFilterTabs = (): FilterTab[] => {
  const tabs: FilterTab[] = Object.entries(GALLERY_CATEGORIES).map(
    ([category, { label, icon, color }]) => ({
      id: category as GalleryCategory,
      label,
      icon,
      color,
    })
  );

  return tabs;
};

const getGalleryItems = (isFullPage: boolean, category?: GalleryCategory): GalleryItem[] => {
  const images: GalleryItem[] = GALLERY_IMAGES.map(img => ({ ...img, type: "image" as const }));
  const videos: GalleryItem[] = GALLERY_VIDEOS.map(vid => ({ ...vid, type: "video" as const }));
  
  // Mix images and videos for better layout
  const allItems = [];
  const maxLength = Math.max(images.length, videos.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < images.length) allItems.push(images[i]);
    if (i < videos.length) allItems.push(videos[i]);
  }
  
  // If category is specified, filter items
  if (category) {
    const filteredItems = allItems.filter(item => item.category === category);
    // For homepage, limit to 4 items per category
    if (!isFullPage) {
      return filteredItems.slice(0, 4);
    }
    return filteredItems;
  }
  
  return allItems;
};

const GallerySection: React.FC<GallerySectionProps> = ({
  isFullPage = false,
  initialCategory,
}) => {
  const t = useTranslations('Gallery');
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialCategory || "photos");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const router = useRouter();

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
              "flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300",
              "backdrop-blur-md border border-white/20",
              activeFilter === tab.id
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            )}
          >
            <span
              className={activeFilter === tab.id ? "text-white" : tab.color}
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
        <h2 className="text-2xl md:text-3xl font-bold text-white/90">
          {filterTabs.find(tab => tab.id === activeFilter)?.label}
        </h2>
        <p className="text-sm md:text-base text-white/60 mt-2">
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
            onItemClick={(item) => setSelectedItem(item as GalleryItem)}
          />
        </div>

      {/* See More Button - only on homepage and when there are more items available */}
      {!isFullPage && totalItemsInCategory > 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Button
            onClick={handleSeeMore}
            className="btn-lg bg-gradient-to-r from-primary to-accent text-white border-none hover:shadow-2xl"
          >
            {t('seeMore')}
          </Button>
        </motion.div>
      )}

      {/* DaisyUI Modal for enlarged view */}
      <input type="checkbox" id="gallery-modal" className="modal-toggle" checked={!!selectedItem} onChange={() => {}} />
      <div className="modal" onClick={() => setSelectedItem(null)}>
        <div className="modal-box max-w-5xl w-full max-h-[95vh] p-2 sm:p-0 bg-black/95" onClick={(e) => e.stopPropagation()}>
          {selectedItem && (
            <>
              {/* Close button */}
              <label 
                htmlFor="gallery-modal" 
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 text-white hover:bg-white/20"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </label>

              {selectedItem.type === "video" ? (
                <div className="aspect-video w-full relative bg-black">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedItem.youtubeId}?autoplay=1`}
                    title={selectedItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative flex items-center justify-center min-h-[50vh] max-h-[90vh] px-2 sm:px-0">
                  <Image
                    src={selectedItem.src || ''}
                    alt={selectedItem.alt || ''}
                    width={1200}
                    height={1600}
                    className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                  />
                </div>
              )}
            </>
          )}
        </div>
        <label className="modal-backdrop" htmlFor="gallery-modal" onClick={() => setSelectedItem(null)}>Close</label>
      </div>
    </section>
  );
};

export default GallerySection;