"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface MasonryItem {
  id: string;
  type: "image" | "video";
  src?: string;
  youtubeId?: string;
  alt?: string;
  title?: string;
  caption?: string;
  category?: string;
}

interface MasonryGalleryProps {
  items: MasonryItem[];
  onItemClick: (item: MasonryItem) => void;
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({ items, onItemClick }) => {
  const [columns, setColumns] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate number of columns based on screen size
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(2);
      else if (width < 1024) setColumns(3);
      else setColumns(4);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Distribute items across columns
  const getColumns = () => {
    const cols: MasonryItem[][] = Array.from({ length: columns }, () => []);
    
    items.forEach((item, index) => {
      const columnIndex = index % columns;
      cols[columnIndex].push(item);
    });
    
    return cols;
  };

  const columnItems = getColumns();

  return (
    <div 
      ref={containerRef}
      className="flex gap-4 w-full"
    >
      {columnItems.map((column, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-4">
          {column.map((item, itemIndex) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: (colIndex * 0.1) + (itemIndex * 0.05) 
              }}
              className={twMerge(
                "relative group cursor-pointer rounded-xl overflow-hidden",
                "shadow-lg backdrop-blur-sm bg-white/5 border border-white/10",
                "hover:shadow-2xl hover:border-white/30 transition-all duration-300"
              )}
              onClick={() => onItemClick(item)}
            >
              {item.type === "video" ? (
                <div className="relative">
                  <div className="relative w-full overflow-hidden">
                    <Image
                      src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                      alt={item.title || "Video thumbnail"}
                      width={480}
                      height={360}
                      className="w-full h-auto object-cover"
                      style={{ aspectRatio: '16/9' }}
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 group-hover:bg-black/40 transition-colors">
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition-all backdrop-blur-sm">
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                        <p className="text-white font-medium text-sm px-3 drop-shadow-lg">{item.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={item.src!}
                    alt={item.alt || "Gallery image"}
                    width={400}
                    height={600}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-semibold text-sm">
                      {item.caption || item.alt}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGallery;