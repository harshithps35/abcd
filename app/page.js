"use client";
import Link from "next/link";
import Navbar from "./components/Navbar";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

const FEATURES = [
  { icon: "📸", title: "3D Pitch Scan", desc: "Upload pitch photos and generate interactive 3D terrain models with crack mapping and surface analysis." },
  { icon: "🔬", title: "Surface Analysis", desc: "AI-powered assessment of moisture, grass cover, soil hardness, and crack patterns for accurate predictions." },
  { icon: "🏏", title: "Player Advantage", desc: "Determine if conditions favor batsmen, pace bowlers, or spinners based on multi-factor pitch intelligence." },
  { icon: "📊", title: "Match Reports", desc: "Generate detailed pre-match pitch reports with scoring predictions, session-wise behavior, and toss advice." },
];

const STATS = [
  { value: "2,400+", label: "Pitches Analyzed" },
  { value: "98.2%", label: "Prediction Accuracy" },
  { value: "156", label: "Venues Covered" },
  { value: "12", label: "ICC Partnerships" },
];

const VENUES = [
  { name: "Wankhede Stadium", location: "Mumbai, India", type: "Spin Friendly", color: "var(--accent-purple)" },
  { name: "The Gabba", location: "Brisbane, Australia", type: "Pace Friendly", color: "var(--accent-green)" },
  { name: "Lord's", location: "London, England", type: "Seam & Swing", color: "var(--accent-blue)" },
  { name: "Eden Gardens", location: "Kolkata, India", type: "Balanced", color: "var(--accent-amber)" },
];

export default function Home() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <div className={styles.gridOverlay}></div>
            <div className={styles.glowOrb1}></div>
            <div className={styles.glowOrb2}></div>
          </div>
          <div className={`${styles.heroContent} ${visible ? styles.visible : ""}`}>
            <span className={styles.heroBadge}>🏟️ AI-Powered Cricket Intelligence</span>
            <h1 className={styles.heroTitle}>
              Decode Every Pitch.<br />
              <span className={styles.heroGradient}>Dominate Every Match.</span>
            </h1>
            <p className={styles.heroDesc}>
              Advanced 3D pitch visualization and AI-driven surface analysis platform.
              Groundsmen upload pitch photos, and our engine delivers real-time assessments
              for batsmen, pace bowlers, and spinners.
            </p>
            <div className={styles.heroBtns}>
              <Link href="/analyze" className="btn-primary">
                Analyze a Pitch →
              </Link>
              <a href="#features" className="btn-secondary">
                Explore Features
              </a>
            </div>
            <div className={styles.heroStats}>
              {STATS.map((s, i) => (
                <div key={i} className={styles.heroStat}>
                  <span className={styles.heroStatValue}>{s.value}</span>
                  <span className={styles.heroStatLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* 3D Pitch Preview */}
          <div className={`${styles.heroVisual} ${visible ? styles.visible : ""}`}>
            <div className={styles.pitchPreview}>
              <div className={styles.pitchSurface}>
                <div className={styles.pitchStrip}></div>
                <div className={styles.pitchCrease1}></div>
                <div className={styles.pitchCrease2}></div>
                <div className={styles.pitchCrack1}></div>
                <div className={styles.pitchCrack2}></div>
                <div className={styles.pitchCrack3}></div>
                <div className={styles.stump1}>|||</div>
                <div className={styles.stump2}>|||</div>
              </div>
              <div className={styles.pitchLabels}>
                <span className={styles.pitchLabel} style={{top:'15%',left:'10%'}}>Dry Patch</span>
                <span className={styles.pitchLabel} style={{top:'50%',right:'5%'}}>Grass Cover: 40%</span>
                <span className={styles.pitchLabel} style={{bottom:'20%',left:'15%'}}>Crack Zone</span>
              </div>
              <div className={styles.scanLine}></div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className={`section ${styles.features}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>Features</span>
              <h2 className="section-title">Complete Pitch Intelligence Suite</h2>
              <p className="section-subtitle">From 3D scanning to match predictions — everything a team needs for pitch-perfect strategy.</p>
            </div>
            <div className="grid-4" style={{marginTop:48}}>
              {FEATURES.map((f, i) => (
                <div key={i} className={`glass-card ${styles.featureCard}`} style={{animationDelay: `${i * 0.1}s`}}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className={`section ${styles.howItWorks}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>Process</span>
              <h2 className="section-title">How PitchVision Works</h2>
              <p className="section-subtitle">Three simple steps from raw pitch photo to strategic match intelligence.</p>
            </div>
            <div className={styles.steps}>
              {[
                { num: "01", title: "Upload Pitch Photo", desc: "Groundsmen capture and upload high-resolution pitch images from multiple angles for comprehensive coverage." },
                { num: "02", title: "AI Analysis & 3D Model", desc: "Our engine processes the image — detecting cracks, moisture, grass density — and generates an interactive 3D terrain model." },
                { num: "03", title: "Get Strategic Report", desc: "Receive a complete assessment: batting conditions, pace/spin advantage, session predictions, and toss recommendation." },
              ].map((s, i) => (
                <div key={i} className={styles.step}>
                  <div className={styles.stepNum}>{s.num}</div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    <p className={styles.stepDesc}>{s.desc}</p>
                  </div>
                  {i < 2 && <div className={styles.stepConnector}></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Venue Spotlight */}
        <section className={`section ${styles.venues}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>Venues</span>
              <h2 className="section-title">Venue Database</h2>
              <p className="section-subtitle">Historical pitch data from top cricket venues worldwide.</p>
            </div>
            <div className="grid-4" style={{marginTop:48}}>
              {VENUES.map((v, i) => (
                <div key={i} className={`glass-card ${styles.venueCard}`}>
                  <div className={styles.venueIndicator} style={{background: v.color}}></div>
                  <h3 className={styles.venueName}>{v.name}</h3>
                  <p className={styles.venueLocation}>{v.location}</p>
                  <span className={styles.venueType} style={{color: v.color}}>{v.type}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`section ${styles.cta}`}>
          <div className="container">
            <div className={styles.ctaCard}>
              <div className={styles.ctaGlow}></div>
              <h2 className={styles.ctaTitle}>Ready to Decode Your Next Pitch?</h2>
              <p className={styles.ctaDesc}>Upload a pitch photo and get an AI-powered assessment in seconds.</p>
              <Link href="/analyze" className="btn-primary" style={{fontSize:'1.1rem',padding:'16px 36px'}}>
                Start Free Analysis →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className="container">
            <div className={styles.footerInner}>
              <div className={styles.footerBrand}>
                <span style={{fontSize:'1.5rem'}}>🏏</span>
                <span className={styles.footerLogo}>PitchVision<span style={{color:'var(--accent-green)'}}>3D</span></span>
              </div>
              <p className={styles.footerCopy}>© 2026 PitchVision 3D. Cricket Intelligence Redefined.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
