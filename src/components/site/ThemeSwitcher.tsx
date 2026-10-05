import { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme } from "./ThemeContext";

export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { theme, currentTheme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn btn-ghost !min-h-10 !px-3 gap-2 border border-border/80 text-xs sm:text-sm font-semibold transition-all hover:border-primary/50"
        aria-label="Change color theme"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Palette className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">Theme:</span>
        <span className="font-bold text-foreground max-w-[100px] truncate sm:max-w-none">
          {currentTheme.name}
        </span>
        <div className="flex items-center -space-x-1.5 ml-1">
          {currentTheme.colors.map((c, i) => (
            <span
              key={i}
              className="inline-block h-3.5 w-3.5 rounded-full border border-background shadow-xs ring-1 ring-border/50"
              style={{ backgroundColor: c.hex }}
              title={`${c.name} (${c.hex})`}
            />
          ))}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card p-3 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-border/60 px-3 pb-2.5 mb-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Color Palettes
              </p>
              <p className="text-sm font-bold text-foreground">Pick a color scheme</p>
            </div>
            <span className="text-[11px] rounded-md bg-primary/20 px-2 py-0.5 font-bold text-primary">
              Live Preview
            </span>
          </div>

          <div className="max-h-[70vh] overflow-y-auto space-y-1.5 pr-1">
            {themes.map((t) => {
              const isActive = t.id === theme;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left rounded-xl p-3 transition-all flex flex-col gap-2 border ${
                    isActive
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-transparent hover:border-border hover:bg-surface/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{t.name}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 bg-muted text-muted-foreground">
                        {t.tagline}
                      </span>
                    </div>
                    {isActive && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    {t.colors.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono border border-border/60 bg-surface/80"
                        title={c.name}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0 border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-muted-foreground">{c.hex}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
