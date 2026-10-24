"use client";

import { useEffect, useState } from "react";
import styles from "./Footer.module.css";
import { Container } from "../layout";

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.topRow}>
          <div className={styles.brandCol}>
            <div className={styles.logoRow}>
              <span className={styles.logoMark}>KK</span>
              <span className={styles.brandTitle}>KRISHNA KUSHWAHA</span>
            </div>
            <p className={styles.brandBio}>
              Motion Designer, Commercial Video Editor, and VFX Compositor.
              Available worldwide for remote post-production.
            </p>
          </div>

          <div className={styles.linksCol}>
            <span className={styles.colHeader}>NAVIGATION</span>
            <ul className={styles.linkList}>
              <li><a href="/#work" className={styles.footerLink}>Featured Projects</a></li>
              <li><a href="/gallery" className={styles.footerLink}>Full Archive (14)</a></li>
              <li><a href="/#about" className={styles.footerLink}>About & Philosophy</a></li>
              <li><a href="/#contact" className={styles.footerLink}>Contact / Inquiries</a></li>
            </ul>
          </div>

          <div className={styles.socialCol}>
            <span className={styles.colHeader}>SOCIAL & ARCHIVE</span>
            <ul className={styles.linkList}>
              <li>
                <a href="https://instagram.com/krisnaefx" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                  Instagram (@krisnaefx) ↗
                </a>
              </li>
              <li>
                <a href="mailto:contact@krishnakushwaha.com" className={styles.footerLink}>
                  contact@krishnakushwaha.com ↗
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                  YouTube Showreels ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.copyright}>
            <span>© {currentYear} Krishna Kushwaha. All rights reserved.</span>
            <span className={styles.dotSep}>•</span>
            <span className={styles.credits}>CRAFTED FOR CINEMATIC IMPACT</span>
          </div>

          <button type="button" onClick={scrollToTop} className={styles.backToTop}>
            <span>BACK TO TOP</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </Container>
    </footer>
  );
}
