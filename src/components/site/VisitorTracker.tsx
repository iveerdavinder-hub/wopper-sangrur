import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { trackVisitorHit } from "@/lib/admin-store";

export function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      trackVisitorHit(location.pathname, document.title);
    }
  }, [location.pathname]);

  return null;
}
