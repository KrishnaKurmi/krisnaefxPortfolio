"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./ProjectHero.module.css";
import { requestExclusiveAudio, silenceAllMedia } from "@/utils/mediaCoordinator";

interface ProjectHeroProps {
  id?: string;
  slug: string;
  title: string;
  role: string;
  year: string;
  tools: string[];
  description: string;
  videoPath: string;
  videoPoster: string;
  index: number;
  category?: string;
}

export function ProjectHero({
  slug,
  title,
  role,
  year,
  tools,
  description,
  videoPath,
  videoPoster,
  index,
  category = "cinematic",
}: ProjectHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start playback muted
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    // Sync play state with native events
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    // Forced mute event when another video un-mutes
    const onForcedMute = () => {
      if (video) video.muted = true;
      setIsMuted(true);
    };
    video.addEventListener("portfolio:forced-mute", onForcedMute);

    // Stop audio & video when window loses focus or tab is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        if (!video.muted) {
          video.muted = true;
          setIsMuted(true);
        }
        video.pause();
        setIsPlaying(false);
      }
    };

    const handleWindowBlur = () => {
      if (!video.muted) {
        video.muted = true;
        setIsMuted(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("portfolio:forced-mute", onForcedMute);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleWindowBlur);

      // Clean up on unmount (e.g. navigating to case study)
      video.pause();
      video.muted = true;
    };
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      // Ensure only this video plays sound!
      requestExclusiveAudio(video);
      // Also ensure video is playing
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  };

  const handleCaseStudyClick = () => {
    silenceAllMedia();
  };

  return (
    <article className={styles.projectHero} data-index={index}>
      {/* Video Container - Clicking toggles play */}
      <div
        className={styles.videoCard}
        onClick={togglePlay}
        title={isPlaying ? "Click to pause" : "Click to play"}
      >
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            className={styles.video}
            poster={videoPoster}
            playsInline
            loop
            muted={isMuted}
            preload="metadata"
          >
            <source src={videoPath} type="video/mp4" />
          </video>
          <div className={styles.vignette} />
        </div>

        {/* Video HUD overlay */}
        <div className={styles.videoHud}>
          <span className={styles.badgeIndex}>PROJECT #{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.badgeCategory}>{category.toUpperCase()}</span>
        </div>

        {/* Floating Controls Overlay (Bottom Right) */}
        <div className={styles.controlsOverlay} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`${styles.controlButton} ${isPlaying ? styles.activeControl : ""}`}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1.5" />
                <rect x="14" y="4" width="4" height="16" rx="1.5" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className={`${styles.controlButton} ${!isMuted ? styles.activeSound : ""}`}
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" fillOpacity="0.2" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Editorial Content Section */}
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <div className={styles.metaRow}>
            <span className={styles.roleLabel}>{role}</span>
            <span className={styles.yearLabel}>{year}</span>
          </div>

          <h3 className={styles.title}>{title}</h3>
        </div>

        <p className={styles.description}>{description}</p>

        {tools.length > 0 && (
          <div className={styles.toolsWrap}>
            <span className={styles.toolsHeader}>TOOLKIT:</span>
            <div className={styles.toolsList}>
              {tools.map((tool) => (
                <span key={tool} className={styles.toolTag}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actionRow}>
          <Link
            href={`/project/${slug}`}
            className={styles.caseStudyLink}
            onClick={handleCaseStudyClick}
          >
            <span>VIEW CASE STUDY</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
