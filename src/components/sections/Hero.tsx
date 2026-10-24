"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import { ShaderRipple } from "../media/ShaderRipple";

export function Hero() {
  const [showShader, setShowShader] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [timecode, setTimecode] = useState("00:00:00:00");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Hide shader smoothly after intro
    const timer = setTimeout(() => setShowShader(false), 2400);

    // Live frame timecode simulator
    const interval = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      const f = String(Math.floor((now.getMilliseconds() / 1000) * 24)).padStart(2, "0");
      setTimecode(`${h}:${m}:${s}:${f}`);
    }, 41);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className={styles.hero}>
      {/* Cinematic Looping Showreel Background */}
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          className={styles.bgVideo}
          src="/media/videos/FlashyEdit.mp4"
          poster="/media/posters/FlashyEdit.jpg"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />
        <div className={styles.videoOverlay} />
        <div className={styles.filmGrain} />
      </div>

      {/* Intro Shader Ripple */}
      {showShader && (
        <div className={styles.shaderContainer}>
          <ShaderRipple />
        </div>
      )}

      {/* Technical HUD / Metadata Header */}
      <div className={styles.hudTop}>
        <div className={styles.statusPill}>
          <span className={styles.pulseDot} />
          <span>AVAILABLE FOR SELECTIVE COMMISSIONS</span>
        </div>
        <div className={styles.timecodePill}>
          <span className={styles.tcLabel}>TC</span>
          <span className={styles.tcVal}>{timecode}</span>
        </div>
        <div className={styles.specsPill}>
          <span>4K PRORES 422 HQ • 24 FPS</span>
        </div>
      </div>

      {/* Main Editorial Hero Content */}
      <div className={styles.content}>
        <div className={styles.textOverlay}>
          <div className={styles.roleKicker}>
            <span>DIRECTOR OF MOTION & POST-PRODUCTION</span>
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleMain}>KRISHNA</span>
            <span className={styles.titleSub}>KUSHWAHA</span>
          </h1>

          <p className={styles.tagline}>
            Cinematic editing, dynamic VFX compositing, and precision color grading.
            Every frame cut to ignite visual impact.
          </p>

          <div className={styles.ctaGroup}>
            <a href="#work" className={styles.primaryCta}>
              <span>EXPLORE FEATURED WORKS</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
            <a href="/gallery" className={styles.secondaryCta}>
              <span>ARCHIVE (14 FILMS)</span>
            </a>
          </div>
        </div>

        {/* Audio / Sound Controller */}
        <div className={styles.audioController}>
          <button
            type="button"
            onClick={toggleAudio}
            className={styles.audioButton}
            aria-label={isMuted ? "Unmute reel" : "Mute reel"}
          >
            <div className={styles.soundWave}>
              <span className={`${styles.bar} ${!isMuted ? styles.active : ""}`} />
              <span className={`${styles.bar} ${!isMuted ? styles.active : ""}`} />
              <span className={`${styles.bar} ${!isMuted ? styles.active : ""}`} />
              <span className={`${styles.bar} ${!isMuted ? styles.active : ""}`} />
            </div>
            <span className={styles.audioText}>{isMuted ? "SOUND OFF" : "SOUND ON"}</span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollTrack}>
          <div className={styles.scrollThumb} />
        </div>
        <span className={styles.scrollLabel}>SCROLL TO EXPLORE</span>
      </div>
    </section>
  );
}
