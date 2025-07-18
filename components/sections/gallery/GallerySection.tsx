"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SectionTitle } from "@/components/SectionTitle";
import { motion } from "framer-motion";
import {
  FaHeart,
} from "react-icons/fa";
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

type FilterType = "all" | GalleryCategory;

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
}

const getFilterTabs = (includeAll: boolean, t: ReturnType<typeof useTranslations>): FilterTab[] => {
  const tabs: FilterTab[] = Object.entries(GALLERY_CATEGORIES).map(
    ([category, { label, icon, color }]) => ({
      id: category as GalleryCategory,
      label,
      icon,
      color,
    })
  );

  if (includeAll) {
    return [
      {
        id: "all" as FilterType,
        label: t('all'),
        icon: <FaHeart size={18} />,
        color: "text-pink-500",
      },
      ...tabs,
    ];
  }

  return tabs;
};

const getGalleryItems = (isFullPage: boolean): GalleryItem[] => {
  const images: GalleryItem[] = GALLERY_IMAGES.map(img => ({ ...img, type: "image" as const }));
  const videos: GalleryItem[] = GALLERY_VIDEOS.map(vid => ({ ...vid, type: "video" as const }));
  
  // Mix images and videos for better layout
  const allItems = [];
  const maxLength = Math.max(images.length, videos.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < images.length) allItems.push(images[i]);
    if (i < videos.length) allItems.push(videos[i]);
  }
  
  // If not full page, limit the items
  if (!isFullPage) {
    return allItems.slice(0, 8);
  }
  
  return allItems;
};

const GallerySection: React.FC<GallerySectionProps> = ({
  isFullPage = false,
}) => {
  const t = useTranslations('Gallery');
  const [activeFilter, setActiveFilter] = useState<FilterType>(
    isFullPage ? "all" : "photos"
  );
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const router = useRouter();

  const filterTabs = getFilterTabs(isFullPage, t);
  const galleryItems = getGalleryItems(isFullPage);

  const filteredItems =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const handleSeeMore = () => {
    router.push("/gallery");
  };

  return (
    <section
      id="gallery"
      className="flex items-center justify-center flex-col space-y-8 relative"
    >
      {!isFullPage && <SectionTitle title={t('title')} isMainSection />}

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={twMerge(
              "flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300",
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
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Masonry Gallery */}
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={twMerge(
            "w-full px-4",
            isFullPage ? "max-w-7xl" : "max-w-6xl"
          )}
        >
          <MasonryGallery 
            items={filteredItems}
            onItemClick={(item) => setSelectedItem(item as GalleryItem)}
          />
        </motion.div>

      {/* See More Button - only on homepage */}
      {!isFullPage && (
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
        <div className="modal-box max-w-5xl w-full max-h-[95vh] p-0 bg-black/95" onClick={(e) => e.stopPropagation()}>
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
                <div className="relative flex items-center justify-center min-h-[50vh] max-h-[90vh]">
                  <Image
                    src={selectedItem.src || ''}
                    alt={selectedItem.alt || ''}
                    width={1200}
                    height={1600}
                    className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                  />
                  {selectedItem.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-lg font-medium">{selectedItem.caption}</p>
                    </div>
                  )}
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