"use client";
import { useState } from "react";
import styles from "./AnalysisPanel.module.css";

function MetricBar({ label, value, color, icon }) {
  return (
    <div className={styles.metric}>
      <div className={styles.metricHeader}>
        <span className={styles.metricIcon}>{icon}</span>
        <span className={styles.metricLabel}>{label}</span>
        <span className={styles.metricValue} style={{ color }}>{value}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${value}%`, background: color }}></div>
      </div>
    </div>
  );
}

function AdvantageCard({ title, value, icon, color, desc }) {
  return (
    <div className={styles.advantageCard} style={{ borderColor: `${color}33` }}>
      <div className={styles.advantageIcon} style={{ background: `${color}15`, color }}>{icon}</div>
      <div className={styles.advantageInfo}>
        <span className={styles.advantageTitle}>{title}</span>
        <span className={styles.advantageValue} style={{ color }}>{value}%</span>
      </div>
      <p className={styles.advantageDesc}>{desc}</p>
    </div>
  );
}

export default function AnalysisPanel({ data }) {
  const [activeTab, setActiveTab] = useState("surface");

  const tabs = [
    { id: "surface", label: "Surface", icon: "🔬" },
    { id: "advantage", label: "Advantage", icon: "⚡" },
    { id: "forecast", label: "Forecast", icon: "📅" },
  ];

  const paceDesc = data.paceAdvantage > 60 ? "Strong seam movement & bounce expected" : data.paceAdvantage > 40 ? "Moderate assistance for pacers" : "Limited help for pace bowlers";
  const spinDesc = data.spinAdvantage > 60 ? "Significant turn & variable bounce" : data.spinAdvantage > 40 ? "Moderate grip for spinners" : "Not much turn available";
  const batDesc = data.batAdvantage > 60 ? "Excellent batting conditions" : data.batAdvantage > 40 ? "Decent for batting, watchful start needed" : "Challenging for batsmen";

  return (
    <div className={styles.panel}>
      {/* Summary Header */}
      <div className={styles.summaryHeader}>
        <div className={styles.summaryTop}>
          <div>
            <h3 className={styles.summaryTitle}>Pitch Assessment</h3>
            <span className={styles.pitchType}>{data.pitchType}</span>
          </div>
          <div className={styles.ratingCircle}>
            <svg viewBox="0 0 80 80" className={styles.ratingSvg}>
              <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <circle cx="40" cy="40" r="35" fill="none" stroke={data.dominanceColor} strokeWidth="6"
                strokeDasharray={`${data.overallRating * 22} 220`} strokeLinecap="round"
                transform="rotate(-90 40 40)" />
            </svg>
            <span className={styles.ratingValue}>{data.overallRating}</span>
            <span className={styles.ratingLabel}>/ 10</span>
          </div>
        </div>
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryCardLabel}>Dominance</span>
            <span className={styles.summaryCardValue} style={{ color: data.dominanceColor }}>{data.dominance}</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryCardLabel}>Toss Decision</span>
            <span className={styles.summaryCardValue} style={{ color: "var(--accent-cyan)" }}>{data.tossDecision}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "surface" && (
          <div className={styles.surfaceTab}>
            <h4 className={styles.tabTitle}>Surface Conditions</h4>
            <div className={styles.metrics}>
              <MetricBar label="Moisture Level" value={data.moisture} color="var(--accent-blue)" icon="💧" />
              <MetricBar label="Grass Cover" value={data.grassCover} color="var(--accent-green)" icon="🌿" />
              <MetricBar label="Surface Hardness" value={data.hardness} color="var(--accent-amber)" icon="🪨" />
              <MetricBar label="Crack Index" value={data.crackIndex} color="var(--accent-red)" icon="⚡" />
              <MetricBar label="Bounce Rating" value={data.bounce} color="var(--accent-cyan)" icon="⬆️" />
              <MetricBar label="Abrasion Level" value={data.abrasion} color="var(--accent-purple)" icon="🔄" />
            </div>
          </div>
        )}

        {activeTab === "advantage" && (
          <div className={styles.advantageTab}>
            <h4 className={styles.tabTitle}>Player Advantage Analysis</h4>
            <div className={styles.advantages}>
              <AdvantageCard title="Pace Bowlers" value={data.paceAdvantage} icon="🏏" color="var(--accent-green)" desc={paceDesc} />
              <AdvantageCard title="Spin Bowlers" value={data.spinAdvantage} icon="🌀" color="var(--accent-purple)" desc={spinDesc} />
              <AdvantageCard title="Batsmen" value={data.batAdvantage} icon="🏏" color="var(--accent-blue)" desc={batDesc} />
            </div>
            <div className={styles.verdictBox}>
              <h4>🎯 Strategic Verdict</h4>
              <p>This pitch <strong style={{ color: data.dominanceColor }}>favors {data.dominance.toLowerCase()}</strong>.
                {data.tossDecision === "Bowl First"
                  ? " Win the toss and bowl first to exploit early conditions."
                  : " Win the toss and bat first to put up a commanding total."
                }
              </p>
            </div>
          </div>
        )}

        {activeTab === "forecast" && (
          <div className={styles.forecastTab}>
            <h4 className={styles.tabTitle}>Session-by-Session Forecast</h4>
            <div className={styles.forecastList}>
              {data.sessionForecast.map((s, i) => (
                <div key={i} className={styles.forecastItem}>
                  <div className={styles.forecastDay}>
                    <span className={styles.forecastDayNum}>{s.session}</span>
                  </div>
                  <div className={styles.forecastLine}></div>
                  <div className={styles.forecastPrediction}>
                    <p>{s.prediction}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.verdictBox}>
              <h4>📊 Test Match Summary</h4>
              <p>Expect this pitch to offer most to <strong style={{ color: data.dominanceColor }}>{data.dominance.toLowerCase()}</strong>.
                {data.crackIndex > 40 ? " Day 4-5 will see significant deterioration with variable bounce and turn." : " Surface should hold up reasonably well through all 5 days."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
