import {
  FaTheaterMasks,
  FaHeart,
  FaChalkboardTeacher,
  FaCamera,
} from "react-icons/fa";

export const YOUTUBE_VIDEOS = [
  "kR-lwIGdiOA",
  "1LI82It0cbU",
  "1-RSFcqptRQ",
  "26-FojKUri4",
];

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  caption?: string;
  date?: string;
}

export interface GalleryVideo {
  id: string;
  youtubeId: string;
  title: string;
  category: GalleryCategory;
  description?: string;
}

export type GalleryCategory = "photos" | "shows" | "social" | "workshop";

export const GALLERY_CATEGORIES: Record<
  GalleryCategory,
  { label: string; description?: string; icon: React.ReactNode; color: string }
> = {
  photos: {
    label: "Photos",
    description: "Dance photos and memories",
    icon: <FaCamera size={18} />,
    color: "text-amber-500",
  },
  shows: {
    label: "Shows",
    description: "Live dance performances and showcases",
    icon: <FaTheaterMasks size={18} />,
    color: "text-purple-500",
  },
  social: {
    label: "Social Dancing",
    description: "Social dance nights and parties",
    icon: <FaHeart size={18} />,
    color: "text-red-500",
  },
  workshop: {
    label: "Workshops",
    description: "Special workshops and masterclasses",
    icon: <FaChalkboardTeacher size={18} />,
    color: "text-blue-500",
  },
};

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "instructor-1",
    src: "/images/instructor-anna.jpg",
    alt: "Instructor Anna",
    category: "photos",
    caption: "Anna - Lead Salsa Instructor",
  },
  {
    id: "instructor-2",
    src: "/images/instructor-konstantinos.jpg",
    alt: "Instructor Konstantinos",
    category: "photos",
    caption: "Konstantinos - Salsa Instructor",
  },
  {
    id: "dance-1",
    src: "/images/hero.jpg",
    alt: "Dance Performance",
    category: "photos",
    caption: "Amazing Salsa Performance",
  },
  {
    id: "social-1",
    src: "/images/logo-big.png",
    alt: "Social Dance Night",
    category: "social",
    caption: "Friday Night Social",
  },
];

export const GALLERY_VIDEOS: GalleryVideo[] = [
  {
    id: "1",
    youtubeId: "kR-lwIGdiOA",
    title: "Salsa Performance",
    category: "shows",
  },
  {
    id: "2",
    youtubeId: "1LI82It0cbU",
    title: "Dance Showcase",
    category: "shows",
  },
  {
    id: "3",
    youtubeId: "1-RSFcqptRQ",
    title: "Workshop Demonstration",
    category: "workshop",
  },
  {
    id: "4",
    youtubeId: "26-FojKUri4",
    title: "Social Dancing Night",
    category: "social",
  },
];

export const getItemsByCategory = (category: GalleryCategory) => {
  return {
    images: GALLERY_IMAGES.filter((img) => img.category === category),
    videos: GALLERY_VIDEOS.filter((vid) => vid.category === category),
  };
};

export const getAllGalleryItems = () => {
  return {
    images: GALLERY_IMAGES,
    videos: GALLERY_VIDEOS,
  };
};
