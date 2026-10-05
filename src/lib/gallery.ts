const imageModules = import.meta.glob<{ default: string }>(
  "../assets/gallery/*.jpg",
  { eager: true }
);

import rawGalleryData from "./gallery-data.json";

export interface GalleryItem {
  id: string;
  img: string;
  cat: string;
  alt: string;
  title: string;
}

export const GALLERY_CATEGORIES = [
  "All",
  "Bowling",
  "Arcade Games",
  "VR Games",
  "Trampoline",
  "Wall Climbing",
  "Pit Ball",
  "Bumper Cars",
  "Kids Zone",
  "Venue & Cafe",
  "Celebrations",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const GALLERY_ITEMS: GalleryItem[] = rawGalleryData.map((item) => {
  const modKey = `../assets/gallery/${item.name}`;
  const mod = imageModules[modKey];
  return {
    id: item.name.replace(/\.jpg$/, ""),
    img: mod ? mod.default : "",
    cat: item.cat,
    alt: item.alt,
    title: item.alt,
  };
});
