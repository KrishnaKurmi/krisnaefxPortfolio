"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { silenceAllMedia } from "@/utils/mediaCoordinator";

export function MediaFocusListener() {
  const pathname = usePathname();

  // Silence all active audio/video when switching routes (e.g. going to case study or back)
  useEffect(() => {
    silenceAllMedia();
  }, [pathname]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // Tab is hidden or user minimized browser
        const allMedia = document.querySelectorAll<HTMLMediaElement>("video, audio");
        allMedia.forEach((media) => {
          if (!media.paused && !media.muted) {
            media.pause();
            media.dispatchEvent(new CustomEvent("portfolio:window-hidden"));
          }
        });
      }
    };

    const handleWindowBlur = () => {
      // Window lost focus (alt-tabbed, switched monitor, clicked outside)
      const allMedia = document.querySelectorAll<HTMLMediaElement>("video, audio");
      allMedia.forEach((media) => {
        if (!media.muted) {
          media.muted = true;
          media.dispatchEvent(new CustomEvent("portfolio:forced-mute"));
        }
      });
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  return null;
}
