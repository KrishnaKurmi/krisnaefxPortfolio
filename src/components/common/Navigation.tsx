"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navigation.module.css";
import { Container } from "../layout";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "SHOWCASE", href: "/#work" },
    { label: "ARCHIVE (14)", href: "/gallery" },
    { label: "ABOUT", href: "/#about" },
    { label: "CONTACT", href: "/#contact" },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <Container className={styles.content}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>KK</span>
          <div className={styles.logoMeta}>
            <span className={styles.logoTitle}>KRISHNA</span>
            <span className={styles.logoSub}>POST & MOTION</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={styles.navLink}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a href="/#contact" className={styles.navCta}>
            <span>LET'S WORK</span>
          </a>
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

        {/* Mobile Navigation Drawer */}
        <div className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ""}`}>
          <ul className={styles.mobileNavList}>
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.drawerFooter}>
            <a
              href="/#contact"
              className={styles.drawerCta}
              onClick={() => setIsOpen(false)}
            >
              START A PROJECT
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
