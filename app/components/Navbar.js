"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🏏</span>
          <span className={styles.logoText}>
            Pitch<span className={styles.logoAccent}>Vision</span>
            <span className={styles.logo3d}>3D</span>
          </span>
        </Link>
        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          <Link href="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/analyze" className={styles.navLink} onClick={() => setMenuOpen(false)}>Analyze Pitch</Link>
          <Link href="/reports" className={styles.navLink} onClick={() => setMenuOpen(false)}>Reports</Link>
          <Link href="/analyze" className={styles.ctaBtn} onClick={() => setMenuOpen(false)}>
            Start Analysis →
          </Link>
        </div>
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`}></span>
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`}></span>
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`}></span>
        </button>
      </div>
    </nav>
  );
}
