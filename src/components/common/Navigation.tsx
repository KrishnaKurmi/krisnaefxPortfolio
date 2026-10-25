"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navigation.module.css";
import { Container } from "../layout";
import { useArchiveTransition } from "./ArchiveTransitionProvider";

interface NavItem {
  label: string;
  href: string;
  count?: string;
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { triggerTransition } = useArchiveTransition();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: "SHOWCASE", href: "/#work" },
    { label: "ARCHIVE", href: "/gallery", count: "14" },
    { label: "ABOUT", href: "/#about" },
    { label: "CONTACT", href: "/#contact" },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <Container className={styles.container}>
        <div className={styles.chassis}>
          {/* Brand Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoMarkWrap}>
              <span className={styles.logoMark}>KK</span>
              <span className={styles.logoMarkGlow} aria-hidden="true" />
            </div>
            <div className={styles.logoMeta}>
              <div className={styles.logoTitleRow}>
                <span className={styles.logoTitle}>KRISHNA</span>
                <span className={styles.statusBadge}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  <span className={styles.statusText}>AVAIL</span>
                </span>
              </div>
              <span className={styles.logoSub}>POST & MOTION / VFX</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav} aria-label="Primary Navigation">
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={styles.navLink}
                    onClick={(e) => {
                      if (item.href === "/gallery") {
                        e.preventDefault();
                        triggerTransition("/gallery");
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    {item.count && (
                      <span className={styles.archiveCount}>{item.count}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <Link href="/#contact" className={styles.navCta}>
              <span className={styles.ctaGlow} aria-hidden="true" />
              <span>LET&apos;S WORK</span>
              <svg
                className={styles.ctaIcon}
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`${styles.menuButton} ${isOpen ? styles.open : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span className={styles.hamburger}></span>
          </button>
        </div>
      </Container>

      {/* Mobile Navigation Drawer */}
      <div className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerBackdropGlow} aria-hidden="true" />
        <div className={styles.drawerHeader}>
          <span>EXPLORE</span>
          <span className={styles.drawerStatus}>
            <span className={styles.statusDot} aria-hidden="true" />
            OPEN FOR COMMISSIONS
          </span>
        </div>
        <ul className={styles.mobileNavList}>
          {navItems.map((item, idx) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={styles.mobileNavLink}
                onClick={(e) => {
                  setIsOpen(false);
                  if (item.href === "/gallery") {
                    e.preventDefault();
                    triggerTransition("/gallery");
                  }
                }}
              >
                <span className={styles.mobileNavNum}>0{idx + 1}</span>
                <span className={styles.mobileNavText}>{item.label}</span>
                {item.count && (
                  <span className={styles.mobileArchiveCount}>({item.count})</span>
                )}
                <span className={styles.mobileNavArrow}>→</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.drawerFooter}>
          <Link
            href="/#contact"
            className={styles.drawerCta}
            onClick={() => setIsOpen(false)}
          >
            <span>START A PROJECT</span>
            <span>↗</span>
          </Link>
          <div className={styles.drawerMeta}>
            <span>KRISHNA KUSHWAHA</span>
            <span>CINEMATIC EDITING & VFX</span>
          </div>
        </div>
      </div>
    </header>
  );
}
