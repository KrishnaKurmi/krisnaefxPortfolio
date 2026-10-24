"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import styles from "./VideoCard.module.css";
import { Caption } from "../typography";

interface VideoCardProps {
  title: string;
  videoPath: string;
  videoPoster: string;
  slug: string;
  role: string;
  category: "energetic" | "cinematic" | "typography" | "commercial";
}

export function VideoCard({
  title,
  videoPath,
  videoPoster,
  slug,
  role,
  category,
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered) {
      video.play().catch(() => {
        // Autoplay may be blocked
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <Link href={`/project/${slug}`}>
      <article
        className={`${styles.videoCard} ${styles[category]}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Video Container */}
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.video}
            poster={videoPoster}
            muted
            playsInline
            loop
            controlsList="nodownload"
          >
            <source src={videoPath} type="video/mp4" />
          </video>

          {/* Play Icon Overlay */}
          <div className={`${styles.playOverlay} ${isHovered ? styles.visible : ""}`}>
            <div className={styles.playIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Category Badge */}
          <div className={styles.categoryBadge}>
            <Caption variant="primary">{category}</Caption>
          </div>
        </div>

        {/* Content Overlay */}
        <div className={`${styles.content} ${isHovered ? styles.visible : ""}`}>
          <h3 className={styles.title}>{title}</h3>
          <Caption variant="secondary">{role}</Caption>
        </div>
      </article>
    </Link>
  );
}
