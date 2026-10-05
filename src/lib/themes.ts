export interface ThemeColor {
  name: string;
  hex: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  tagline: string;
  colors: ThemeColor[];
  description: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: "mint-charcoal",
    name: "Mint & Charcoal",
    tagline: "Clean & Fresh",
    colors: [
      { name: "Mint Green", hex: "#A8E6CF" },
      { name: "Light Grey", hex: "#F0F0F0" },
      { name: "Charcoal", hex: "#333333" },
    ],
    description: "Clean and fresh, with a professional yet playful edge.",
  },
  {
    id: "lavender-tech",
    name: "Lavender & Soft Blue",
    tagline: "Dreamy & Futuristic",
    colors: [
      { name: "Lavender", hex: "#C5B4E3" },
      { name: "Soft Blue", hex: "#A7C7E7" },
      { name: "White", hex: "#FFFFFF" },
    ],
    description: "Dreamy and futuristic, perfect for a tech‑gaming aesthetic.",
  },
  {
    id: "peach-beige",
    name: "Peach & Warm Beige",
    tagline: "Cozy & Approachable",
    colors: [
      { name: "Peach", hex: "#FFDAB9" },
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Warm Grey", hex: "#B0A999" },
    ],
    description: "Cozy and approachable, ideal for casual or community‑focused gaming sites.",
  },
  {
    id: "sky-yellow",
    name: "Sky Blue & Pale Yellow",
    tagline: "Cheerful & Uplifting",
    colors: [
      { name: "Sky Blue", hex: "#87CEEB" },
      { name: "Pale Yellow", hex: "#FFFACD" },
      { name: "Slate Grey", hex: "#708090" },
    ],
    description: "Cheerful and uplifting, great for a vibrant homepage.",
  },
  {
    id: "dusty-pink",
    name: "Dusty Pink & Light Slate",
    tagline: "Stylish & Contemporary",
    colors: [
      { name: "Dusty Pink", hex: "#E6AFAF" },
      { name: "Light Slate", hex: "#778899" },
      { name: "Black Accents", hex: "#000000" },
    ],
    description: "Stylish and contemporary, with a subtle edge for competitive gaming.",
  },
  {
    id: "neon-dark",
    name: "Original Neon Night",
    tagline: "Neon Arcade",
    colors: [
      { name: "Neon Lime", hex: "#2EE59D" },
      { name: "Deep Slate", hex: "#141715" },
      { name: "Cyber Orange", hex: "#FF8C42" },
    ],
    description: "Signature Wopper Sangrur arcade dark neon look.",
  },
];

export const DEFAULT_THEME_ID = "lavender-tech";
