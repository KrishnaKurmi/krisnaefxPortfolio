"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./VideoTheater.module.css";
import { requestExclusiveAudio, silenceAllMedia } from "@/utils/mediaCoordinator";

interface VideoTheaterProps {
  videoPath: string;
  videoPoster: string;
  title: string;
}

export function VideoTheater({ videoPath, videoPoster, title }: VideoTheaterProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // When opening a video detail page, ensure all other background media is silenced immediately!
    silenceAllMedia();

    const video = videoRef.current;
    if (!video) return;

    // Start playing this video
    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          requestExclusiveAudio(video);
        })
        .catch(() => {
          // If browser policy blocks unmuted autoplay, fall back to muted autoplay
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        });
    }

    // Sync state with native events
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    // Stop / pause when window or tab is not focused
    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
        setIsPlaying(false);
      }
    };

    const handleWindowBlur = () => {
      // Pause video when window loses focus (switched app, alt-tab, etc.)
      video.pause();
      setIsPlaying(false);
    };

    const handleForcedMute = () => {
      video.muted = true;
      setIsMuted(true);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleWindowBlur);
    video.addEventListener("portfolio:forced-mute", handleForcedMute);

    return () => {
      // Unmount cleanup: immediately stop and silence video so sound NEVER continues in background!
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("portfolio:forced-mute", handleForcedMute);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleWindowBlur);

      video.pause();
      video.muted = true;
      video.removeAttribute("src");
      video.load();
    };
  }, [videoPath]);

  return (
    <div className={styles.theaterContainer}>
      <video
        ref={videoRef}
        className={styles.theaterVideo}
        poster={videoPoster}
        controls
        playsInline
        preload="auto"
        aria-label={`Video player for ${title}`}
      >
        <source src={videoPath} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
}
