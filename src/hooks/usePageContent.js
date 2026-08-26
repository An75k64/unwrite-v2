"use client";
import { useState, useEffect } from "react";
import { getPageContent } from "../lib/adminStore";

/**
 * Hook: reads page content from adminStore (localStorage).
 * Falls back to seed values automatically.
 * Usage: const c = usePageContent("home");
 */
export function usePageContent(pageName) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const all = getPageContent();
    setContent(all[pageName] || {});

    // Live-sync if admin saves while page is open
    const handler = () => {
      const updated = getPageContent();
      setContent(updated[pageName] || {});
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [pageName]);

  return content;
}
