import { useState } from "react";
import Navbar from "../components/Navbar";
import styles from "./Reports.module.css";

const SAMPLE_REPORTS = [
  {
    id: 1, venue: "Wankhede Stadium", location: "Mumbai, India", date: "May 15, 2026",
    matchType: "Test Match", pitchType: "Dry & Cracked", rating: 7.2,
    dominance: "Spin Bowlers", dominanceColor: "var(--accent-purple)",
    toss: "Bat First", moisture: 18, grass: 15, cracks: 72, hardness: 65,
    pace: 32, spin: 78, bat: 55,
    summary: "Classic Mumbai turner. Significant cracks developing from Day 1. Spinners will dominate from the third session onwards. Batting first is crucial as the pitch deteriorates rapidly.",
  },
  {
    id: 2, venue: "The Gabba", location: "Brisbane, Australia", date: "May 10, 2026",
    matchType: "Test Match", pitchType: "Green Top", rating: 8.1,
    dominance: "Pace Bowlers", dominanceColor: "var(--accent-green)",
    toss: "Bowl First", moisture: 42, grass: 65, cracks: 8, hardness: 78,
    pace: 82, spin: 22, bat: 58,
    summary: "Lively Gabba deck with plenty of grass cover. Fast bowlers will extract significant movement with the new ball. Bounce is even and true, rewarding good batting.",
  },
  {
    id: 3, venue: "Eden Gardens", location: "Kolkata, India", date: "May 5, 2026",
    matchType: "ODI", pitchType: "Hard & True", rating: 8.8,
    dominance: "Batsmen", dominanceColor: "var(--accent-blue)",
    toss: "Bat First", moisture: 28, grass: 30, cracks: 12, hardness: 82,
    pace: 38, spin: 35, bat: 85,
    summary: "Excellent batting surface at Eden Gardens. True bounce, minimal movement. A 300+ total is expected. Spinners may get some turn in the second innings.",
  },
  {
    id: 4, venue: "Lord's Cricket Ground", location: "London, England", date: "Apr 28, 2026",
    matchType: "Test Match", pitchType: "Seam & Swing", rating: 7.8,
    dominance: "Pace Bowlers", dominanceColor: "var(--accent-green)",
    toss: "Bowl First", moisture: 55, grass: 50, cracks: 5, hardness: 60,
    pace: 75, spin: 18, bat: 52,
    summary: "Overcast conditions at Lord's make this a seamer's paradise. Swing both conventional and reverse will be on offer. Batting requires immense patience.",
  },
  {
    id: 5, venue: "Chepauk Stadium", location: "Chennai, India", date: "Apr 20, 2026",
    matchType: "Test Match", pitchType: "Dry & Cracked", rating: 6.5,
    dominance: "Spin Bowlers", dominanceColor: "var(--accent-purple)",
    toss: "Bat First", moisture: 12, grass: 10, cracks: 80, hardness: 55,
    pace: 20, spin: 88, bat: 40,
    summary: "Red soil Chepauk special. Massive turn from Day 1, cracks widening rapidly. Left-arm spinners will be lethal. Bat first and bat big — surviving on Day 4-5 is near impossible.",
  },
  {
    id: 6, venue: "MCG", location: "Melbourne, Australia", date: "Apr 12, 2026",
    matchType: "Test Match", pitchType: "Balanced", rating: 8.5,
    dominance: "Balanced", dominanceColor: "var(--accent-amber)",
    toss: "Bat First", moisture: 32, grass: 38, cracks: 18, hardness: 72,
    pace: 55, spin: 45, bat: 68,
    summary: "Traditional MCG deck offering something for everyone. New ball movement for pacers, gradual turn for spinners, and consistent bounce for batsmen. A true cricket pitch.",
  },
];

function MiniBar({ value, color }) {
  return (
    <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.8s ease' }}></div>
    </div>
  );
}

export default function Reports() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? SAMPLE_REPORTS :
    SAMPLE_REPORTS.filter(r =>
      filter === "Pace" ? r.dominance === "Pace Bowlers" :
      filter === "Spin" ? r.dominance === "Spin Bowlers" :
      filter === "Bat" ? r.dominance === "Batsmen" : true
    );

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Pitch Reports Database</h1>
          <p className={styles.pageSubtitle}>Browse historical pitch analysis reports from top cricket venues worldwide.</p>
        </div>

        <div className={styles.filters}>
          {["All", "Pace", "Spin", "Bat", "Balanced"].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
              onClick={() => { setFilter(f); setSelected(null); }}
            >
              {f === "Pace" ? "🏏 Pace" : f === "Spin" ? "🌀 Spin" : f === "Bat" ? "🏏 Batting" : f === "Balanced" ? "⚖️ Balanced" : "📋 All"}
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          {/* Report List */}
          <div className={styles.reportList}>
            {filtered.map(r => (
              <div
                key={r.id}
                className={`${styles.reportCard} ${selected?.id === r.id ? styles.reportCardActive : ""}`}
                onClick={() => setSelected(r)}
              >
                <div className={styles.reportCardHeader}>
                  <div>
                    <h3 className={styles.reportVenue}>{r.venue}</h3>
                    <p className={styles.reportLocation}>{r.location}</p>
                  </div>
                  <span className={styles.reportRating} style={{ color: r.dominanceColor }}>{r.rating}</span>
                </div>
                <div className={styles.reportMeta}>
                  <span className={styles.reportDate}>{r.date}</span>
                  <span className={styles.reportType}>{r.matchType}</span>
                  <span className={styles.reportDominance} style={{ color: r.dominanceColor }}>{r.dominance}</span>
                </div>
                <div className={styles.reportToss}>
                  <span className={styles.reportTossIcon}>{r.toss === "Bowl First" ? "🎳" : "🏏"}</span>
                  <span className={styles.reportTossText} style={{
                    color: r.toss === "Bowl First" ? "var(--accent-green)" : "var(--accent-blue)"
                  }}>{r.toss}</span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className={styles.emptyState}>
                <p>No reports found for this filter.</p>
              </div>
            )}
          </div>

          {/* Report Detail */}
          <div className={styles.reportDetail}>
            {selected ? (
              <div className={styles.detailCard}>
                <div className={styles.detailHeader}>
                  <div>
                    <h2 className={styles.detailVenue}>{selected.venue}</h2>
                    <p className={styles.detailLocation}>{selected.location} • {selected.date}</p>
                  </div>
                  <div className={styles.detailRatingBox}>
                    <span className={styles.detailRatingNum}>{selected.rating}</span>
                    <span className={styles.detailRatingLabel}>/ 10</span>
                  </div>
                </div>

                {/* Prominent Toss Recommendation */}
                <div className={styles.detailTossBanner}>
                  <div className={styles.detailTossIcon}>
                    {selected.toss === "Bowl First" ? "🎳" : "🏏"}
                  </div>
                  <div className={styles.detailTossInfo}>
                    <span className={styles.detailTossLabel}>Toss Recommendation</span>
                    <span className={styles.detailTossValue} style={{
                      color: selected.toss === "Bowl First" ? "var(--accent-green)" : "var(--accent-blue)"
                    }}>{selected.toss}</span>
                  </div>
                  <div className={styles.detailTossDominance} style={{
                    color: selected.dominanceColor,
                    background: `color-mix(in srgb, ${selected.dominanceColor === "var(--accent-green)" ? "#22c55e" : selected.dominanceColor === "var(--accent-purple)" ? "#a855f7" : selected.dominanceColor === "var(--accent-blue)" ? "#3b82f6" : "#f59e0b"} 10%, transparent)`
                  }}>
                    {selected.dominance}
                  </div>
                </div>

                <div className={styles.detailBadges}>
                  <span className={`badge ${selected.dominance.includes("Pace") ? "badge-green" : selected.dominance.includes("Spin") ? "badge-purple" : selected.dominance.includes("Bat") ? "badge-blue" : "badge-amber"}`}>
                    {selected.dominance}
                  </span>
                  <span className="badge badge-blue">{selected.pitchType}</span>
                  <span className="badge badge-amber">{selected.toss}</span>
                </div>

                <p className={styles.detailSummary}>{selected.summary}</p>

                <div className={styles.detailSection}>
                  <h4>Surface Metrics</h4>
                  <div className={styles.detailMetrics}>
                    <div className={styles.detailMetric}>
                      <span>💧 Moisture</span><span>{selected.moisture}%</span>
                      <div style={{ gridColumn: '1/-1' }}><MiniBar value={selected.moisture} color="var(--accent-blue)" /></div>
                    </div>
                    <div className={styles.detailMetric}>
                      <span>🌿 Grass</span><span>{selected.grass}%</span>
                      <div style={{ gridColumn: '1/-1' }}><MiniBar value={selected.grass} color="var(--accent-green)" /></div>
                    </div>
                    <div className={styles.detailMetric}>
                      <span>⚡ Cracks</span><span>{selected.cracks}%</span>
                      <div style={{ gridColumn: '1/-1' }}><MiniBar value={selected.cracks} color="var(--accent-red)" /></div>
                    </div>
                    <div className={styles.detailMetric}>
                      <span>🪨 Hardness</span><span>{selected.hardness}%</span>
                      <div style={{ gridColumn: '1/-1' }}><MiniBar value={selected.hardness} color="var(--accent-amber)" /></div>
                    </div>
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <h4>Player Advantage</h4>
                  <div className={styles.advantageBars}>
                    <div className={styles.advBar}>
                      <div className={styles.advBarHeader}><span>🏏 Pace</span><span style={{ color: "var(--accent-green)" }}>{selected.pace}%</span></div>
                      <MiniBar value={selected.pace} color="var(--accent-green)" />
                    </div>
                    <div className={styles.advBar}>
                      <div className={styles.advBarHeader}><span>🌀 Spin</span><span style={{ color: "var(--accent-purple)" }}>{selected.spin}%</span></div>
                      <MiniBar value={selected.spin} color="var(--accent-purple)" />
                    </div>
                    <div className={styles.advBar}>
                      <div className={styles.advBarHeader}><span>🏏 Batting</span><span style={{ color: "var(--accent-blue)" }}>{selected.bat}%</span></div>
                      <MiniBar value={selected.bat} color="var(--accent-blue)" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.detailPlaceholder}>
                <span className={styles.placeholderIcon}>📋</span>
                <h3>Select a Report</h3>
                <p>Click on any pitch report from the list to view detailed analysis.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
