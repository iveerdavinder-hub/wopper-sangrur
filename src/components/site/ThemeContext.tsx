import React, { createContext, useContext, useEffect, useState } from "react";
import { THEMES, DEFAULT_THEME_ID, type ThemeOption } from "@/lib/themes";

interface ThemeContextType {
  theme: string;
  currentTheme: ThemeOption;
  setTheme: (id: string) => void;
  themes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>(DEFAULT_THEME_ID);

  useEffect(() => {
    // Read stored theme or default to mint-charcoal
    try {
      const stored = localStorage.getItem("wopper-theme");
      if (stored && THEMES.some((t) => t.id === stored)) {
        setThemeState(stored);
        document.documentElement.setAttribute("data-theme", stored);
      } else {
        document.documentElement.setAttribute("data-theme", DEFAULT_THEME_ID);
      }
    } catch {
      document.documentElement.setAttribute("data-theme", DEFAULT_THEME_ID);
    }
  }, []);

  const setTheme = (id: string) => {
    setThemeState(id);
    try {
      localStorage.setItem("wopper-theme", id);
      document.documentElement.setAttribute("data-theme", id);
    } catch {
      document.documentElement.setAttribute("data-theme", id);
    }
  };

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
