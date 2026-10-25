"use client";

import { useEffect, useState, useCallback } from "react";
import { ShaderAnimation } from "@/components/media/ShaderAnimation";
import styles from "./ArchiveTransition.module.css";

interface ArchiveTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export function ArchiveTransition({
  isActive,
  onComplete,
}: ArchiveTransitionProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const [shouldRender, setShouldRender] = useState(isActive);

  const handleDismiss = useCallback(() => {
    setIsLeaving(true);
    const timeout = setTimeout(() => {
      setShouldRender(false);
      onComplete();
    }, 650); // Matches CSS transition duration
    return () => clearTimeout(timeout);
  }, [onComplete]);

  useEffect(() => {
    if (isActive) {
      setShouldRender(true);
      setIsLeaving(false);

      // Automatic cinematic sequence duration: 1.8 seconds before dissolve
      const timer = setTimeout(() => {
        handleDismiss();
      }, 1800);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleDismiss();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      setShouldRender(false);
    }
  }, [isActive, handleDismiss]);

  if (!shouldRender) return null;

  return (
    <div
      className={`${styles.transitionOverlay} ${isLeaving ? styles.leaving : ""}`}
      aria-live="polite"
      aria-label="Archive Vault Transitioning"
    >
      {/* 21st.dev procedural kinetic shader background */}
      <div className={styles.shaderCanvasWrapper}>
        <ShaderAnimation speed={0.06} />
      </div>

      <div className={styles.vignetteOverlay} />

      {/* Top HUD */}
      <div className={styles.hudTop}>
        <div className={styles.brandBadge}>
          <div className={styles.pulseDot} />
          <span className={styles.hudLabel}>ARCHIVE VAULT // SECURE LINK</span>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className={styles.skipButton}
          aria-label="Skip shader transition"
        >
          <span>ENTER DIRECTORY</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Center Cinematic Title */}
      <div className={styles.hudCenter}>
        <span className={styles.kicker}>SYSTEM READY // 14 FILMS</span>
        <h2 className={styles.title}>ARCHIVE VAULT</h2>
        <div className={styles.statusRow}>
          <span className={styles.statusText}>
            INITIALIZING PROCEDURAL REELS
          </span>
        </div>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBarFill} />
        </div>
      </div>

      {/* Bottom HUD */}
      <div className={styles.hudBottom}>
        <span className={styles.footerTag}>KRISHNA POST &amp; MOTION // 2026</span>
        <span className={styles.footerTag}>GPU SHADER COMPOSITING • PRESS ESC TO SKIP</span>
      </div>
    </div>
  );
}

export default ArchiveTransition;
