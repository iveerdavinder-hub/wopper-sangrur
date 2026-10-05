import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Camera, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/site/Chrome";
import { GALLERY_ITEMS, GALLERY_CATEGORIES, type GalleryCategory, type GalleryItem } from "@/lib/gallery";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Real Photos | Wopper Sangrur" },
      {
        name: "description",
        content:
          "Browse real photos from Wopper Sangrur across bowling, arcade games, VR adventures, trampoline park, climbing wall, pit ball, and bumper cars.",
      },
      { property: "og:title", content: "Gallery — Wopper Sangrur" },
      {
        property: "og:description",
        content: "Authentic moments from Wopper Sangrur's game arenas and adventures.",
      },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredItems = GALLERY_ITEMS.filter(
    (item) => selectedCategory === "All" || item.cat === selectedCategory
  );

  const activeItem: GalleryItem | null =
    selectedIndex !== null && filteredItems[selectedIndex]
      ? (filteredItems[selectedIndex] as GalleryItem)
      : null;

  useEffect(() => {
    if (selectedIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
        );
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, filteredItems.length]);

  return (
    <>
      <PageHero
        eyebrow="Official Gallery"
        title="Inside Wopper Sangrur."
        sub="Authentic photos from Wopper Sangrur — browse real moments across bowling, arcade machines, VR rides, trampolines, pit ball, bumper cars, and celebrations."
      />

      <div className="mx-auto max-w-7xl px-5 pb-24">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Game categories">
          {GALLERY_CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? GALLERY_ITEMS.length
                : GALLERY_ITEMS.filter((i) => i.cat === cat).length;

            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedIndex(null);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "border-border bg-card/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-xs font-mono font-medium ${
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Maps Attribution & Info Banner */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/40 p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            <span>
              Showing {filteredItems.length} photos {selectedCategory !== "All" ? `in "${selectedCategory}"` : "across all categories"} from Wopper Sangrur.
            </span>
          </div>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
          >
            <span>View on Google Maps</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Photo Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
            >
              <button
                onClick={() => setSelectedIndex(index)}
                className="block h-64 w-full overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`View photo: ${item.alt}`}
              >
                <img
                  src={item.img}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-3.5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="inline-block rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
                  {item.cat}
                </span>
                <p className="mt-1 line-clamp-2 text-xs font-medium text-white/95">
                  {item.alt}
                </p>
              </div>

              {/* Category pill permanently visible at top */}
              <div className="pointer-events-none absolute left-3 top-3">
                <span className="rounded-md border border-white/20 bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                  {item.cat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.alt}
        >
          {/* Close button */}
          <button
            className="absolute right-5 top-5 z-10 rounded-full border border-white/20 bg-black/60 p-2.5 text-white transition-colors hover:bg-white hover:text-black focus:outline-none"
            aria-label="Close photo preview"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Prev */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full border border-white/20 bg-black/60 p-3 text-white transition-colors hover:bg-white hover:text-black focus:outline-none"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(
                selectedIndex > 0 ? selectedIndex - 1 : filteredItems.length - 1
              );
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Navigation Next */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full border border-white/20 bg-black/60 p-3 text-white transition-colors hover:bg-white hover:text-black focus:outline-none"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(
                selectedIndex < filteredItems.length - 1 ? selectedIndex + 1 : 0
              );
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image & Caption */}
          <div
            className="relative flex max-h-[92vh] max-w-5xl flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeItem.img}
              alt={activeItem.alt}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="mt-3 flex w-full flex-wrap items-center justify-between gap-3 px-2 text-white">
              <div>
                <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-bold uppercase text-primary-foreground">
                  {activeItem.cat}
                </span>
                <p className="mt-1 text-sm font-medium text-white/90">
                  {activeItem.alt}
                </p>
              </div>
              <span className="text-xs font-mono text-white/60">
                {selectedIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
