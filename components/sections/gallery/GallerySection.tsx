"use client";

import { useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { motion, AnimatePresence } from "framer-motion";
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

const getFilterTabs = (includeAll: boolean): FilterTab[] => {
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
        label: "All",
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
  const [activeFilter, setActiveFilter] = useState<FilterType>(
    isFullPage ? "all" : "photos"
  );
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const router = useRouter();

  const filterTabs = getFilterTabs(isFullPage);
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
      {!isFullPage && <SectionTitle title="Gallery" isMainSection />}

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
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
      </AnimatePresence>

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
            See More
          </Button>
        </motion.div>
      )}

      {/* Modal for enlarged view */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute -top-12 right-0 text-white text-3xl hover:text-primary transition-colors z-10"
                onClick={() => setSelectedItem(null)}
              >
                ×
              </button>

              {selectedItem.type === "video" ? (
                <div className="aspect-video w-full relative bg-black rounded-xl overflow-hidden shadow-2xl">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedItem.youtubeId}?autoplay=1`}
                    title={selectedItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden shadow-2xl max-h-[90vh]">
                  <Image
                    src={selectedItem.src}
                    alt={selectedItem.alt}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;