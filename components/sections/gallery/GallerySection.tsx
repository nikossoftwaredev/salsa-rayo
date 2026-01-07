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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MasonryGallery from "./MasonryGallery";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoClose } from "react-icons/io5";

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
              "flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer",
              "backdrop-blur-md border border-border/20",
              activeFilter === tab.id
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg scale-105"
                : "bg-card text-foreground/80 hover:bg-card/80 hover:scale-105 hover:shadow-md hover:border-primary/30"
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
            onItemClick={(item) => setSelectedItem(item as GalleryItem)}
          />
        </div>

      {/* See More Button - only on homepage and when there are more items available */}
      {!isFullPage && totalItemsInCategory > 4 && (
        <div className="mt-12">
          <Button
            variant="gradient"
            onClick={handleSeeMore}
            className="px-8 py-3 text-lg"
          >
            {t('seeMore')}
          </Button>
        </div>
      )}

      {/* Dialog for enlarged view */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/90 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          />
          
          {/* Content */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background hover:scale-110 transition-all duration-200"
            >
              <IoClose className="w-6 h-6 text-foreground" />
            </button>
            
            {selectedItem.type === "video" ? (
              <div className="relative w-full max-w-6xl aspect-video">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${selectedItem.youtubeId}?autoplay=1`}
                  title={selectedItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <Image
                src={selectedItem.src || ''}
                alt={selectedItem.alt || ''}
                width={2400}
                height={2400}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                quality={100}
                priority
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;