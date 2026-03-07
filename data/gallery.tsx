import {
  FaTheaterMasks,
  FaHeart,
  FaChalkboardTeacher,
  FaCamera,
} from "react-icons/fa";

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
    alt: "Anna Lontou, lead salsa instructor at Salsa Rayo Athens",
    category: "photos",
  },
  {
    id: "instructor-2",
    src: "/images/instructor-konstantinos.jpg",
    alt: "Konstantinos Bitsis, lead dance instructor at Salsa Rayo Athens",
    category: "photos",
  },
  {
    id: "dance-1",
    src: "/images/hero.jpg",
    alt: "Salsa Rayo dance performance at a live event in Athens",
    category: "photos",
  },
  {
    id: "gallery-1",
    src: "/images/gallery/0C6A0295 copy-min.jpg",
    alt: "Salsa partners dancing at Salsa Rayo social night",
    category: "photos",
  },
  {
    id: "gallery-2",
    src: "/images/gallery/0C6A0451 copy 3-min.jpg",
    alt: "Couple performing bachata at Salsa Rayo dance event",
    category: "photos",
  },
  {
    id: "gallery-3",
    src: "/images/gallery/DSC03795-min.jpg",
    alt: "Group salsa class in progress at Salsa Rayo studio",
    category: "photos",
  },
  {
    id: "gallery-4",
    src: "/images/gallery/FB_IMG_1665228989230-min.jpg",
    alt: "Salsa dancers at a Salsa Rayo workshop in Athens",
    category: "photos",
  },
  {
    id: "gallery-5",
    src: "/images/gallery/FB_IMG_1686562107377-min.jpg",
    alt: "Students practicing salsa moves during class at Salsa Rayo",
    category: "photos",
  },
  {
    id: "gallery-6",
    src: "/images/gallery/FB_IMG_1696885805374-min.jpg",
    alt: "Dance social event hosted by Salsa Rayo in Agios Dimitrios",
    category: "photos",
  },
  {
    id: "gallery-7",
    src: "/images/gallery/FB_IMG_1696885842413-min.jpg",
    alt: "Salsa Rayo community gathering and social dancing night",
    category: "photos",
  },
  {
    id: "gallery-8",
    src: "/images/gallery/FB_IMG_1711453460062-min.jpg",
    alt: "Bachata performance by Salsa Rayo instructors",
    category: "photos",
  },
  {
    id: "gallery-9",
    src: "/images/gallery/FB_IMG_1733617704248-min.jpg",
    alt: "Salsa Rayo students at an end-of-season dance showcase",
    category: "photos",
  },
  {
    id: "gallery-10",
    src: "/images/gallery/IMG-20241027-WA0006-min.jpg",
    alt: "Dance party atmosphere at Salsa Rayo Athens",
    category: "photos",
  },
  {
    id: "gallery-11",
    src: "/images/gallery/IMG_20250809_130140-min.jpg",
    alt: "Salsa Rayo dance studio entrance and reception area",
    category: "photos",
  },
  {
    id: "gallery-12",
    src: "/images/gallery/IMG_20250809_130222-min.jpg",
    alt: "Salsa Rayo studio lounge area for students",
    category: "photos",
  },
  {
    id: "gallery-13",
    src: "/images/gallery/Screenshot_2024-05-19-16-24-44-935_com.facebook.katana-min.jpg",
    alt: "Salsa Rayo dance school featured on social media",
    category: "photos",
  },
  {
    id: "gallery-14",
    src: "/images/gallery/our-space.jpg",
    alt: "Salsa Rayo dance studio interior with professional hardwood floor",
    category: "photos",
  },
  {
    id: "gallery-15",
    src: "/images/gallery/our-space-vertical.jpg",
    alt: "Salsa Rayo dance studio full-length view of practice space",
    category: "photos",
  },
];

export const GALLERY_VIDEOS: GalleryVideo[] = [
  {
    id: "1",
    youtubeId: "kR-lwIGdiOA",
    title: "Salsa Performance",
    category: "social",
  },
  {
    id: "2",
    youtubeId: "1LI82It0cbU",
    title: "Dance Showcase",
    category: "social",
  },
  {
    id: "3",
    youtubeId: "1-RSFcqptRQ",
    title: "Blue Show",
    category: "shows",
  },
  {
    id: "4",
    youtubeId: "26-FojKUri4",
    title: "Green Show",
    category: "shows",
  },
  {
    id: "5",
    youtubeId: "69QQe-d6kjk",
    title: "Social Dancing",
    category: "social",
  },
  {
    id: "6",
    youtubeId: "BJdqmhEjVJ0",
    title: "Social Dancing",
    category: "social",
  },
  {
    id: "7",
    youtubeId: "8yApaOR6h8s",
    title: "Social Dancing",
    category: "social",
  },
  {
    id: "8",
    youtubeId: "H5vuRneJD0g",
    title: "Social Dancing",
    category: "social",
  },
  {
    id: "9",
    youtubeId: "ryofoimkmPM",
    title: "Social Dancing",
    category: "social",
  },
  {
    id: "10",
    youtubeId: "snSCrHJcIgk",
    title: "Social Dancing",
    category: "social",
  },
  {
    id: "11",
    youtubeId: "A88I-_1x7Io",
    title: "Social Dancing",
    category: "social",
  },
  {
    id: "12",
    youtubeId: "JREhE_wJAc8",
    title: "Social Dancing",
    category: "social",
  },
];
