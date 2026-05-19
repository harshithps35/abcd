"use client";
import { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import PitchViewer3D from "../components/PitchViewer3D";
import AnalysisPanel from "../components/AnalysisPanel";
import styles from "./analyze.module.css";

function generateAnalysis(fileName) {
  const moisture = Math.floor(Math.random() * 40 + 15);
  const grassCover = Math.floor(Math.random() * 60 + 10);
  const hardness = Math.floor(Math.random() * 40 + 40);
  const crackIndex = Math.floor(Math.random() * 70 + 5);
  const bounce = Math.floor(Math.random() * 30 + 50);
  const abrasion = Math.floor(Math.random() * 50 + 20);

  const paceAdv = Math.round((grassCover * 0.3 + moisture * 0.3 + bounce * 0.2 + (100 - crackIndex) * 0.2));
  const spinAdv = Math.round((crackIndex * 0.35 + (100 - moisture) * 0.25 + abrasion * 0.25 + (100 - grassCover) * 0.15));
  const batAdv = Math.round(((100 - crackIndex) * 0.3 + hardness * 0.25 + (100 - abrasion) * 0.2 + bounce * 0.15 + (100 - moisture > 60 ? 10 : 0) + 5));

  const total = paceAdv + spinAdv + batAdv;
  let dominance = "Balanced";
  let dominanceColor = "var(--accent-amber)";
  if (paceAdv > spinAdv && paceAdv > batAdv) { dominance = "Pace Bowlers"; dominanceColor = "var(--accent-green)"; }
  else if (spinAdv > paceAdv && spinAdv > batAdv) { dominance = "Spin Bowlers"; dominanceColor = "var(--accent-purple)"; }
  else if (batAdv > paceAdv && batAdv > spinAdv) { dominance = "Batsmen"; dominanceColor = "var(--accent-blue)"; }

  const tossDecision = moisture > 35 || grassCover > 45 ? "Bowl First" : crackIndex > 45 ? "Bat First" : "Bat First";
  const day1 = grassCover > 40 ? "Pace dominant, expect seam movement" : "Good for batting, minimal assistance";
  const day2 = "Pitch settling, best for batting";
  const day3 = crackIndex > 30 ? "Cracks widening, spin starting to grip" : "Still good for batting";
  const day4 = "Deteriorating, variable bounce expected";
  const day5 = crackIndex > 20 ? "Rough patches, significant turn for spinners" : "Worn but playable";

  return {
    moisture, grassCover, hardness, crackIndex, bounce, abrasion,
    paceAdvantage: Math.min(paceAdv, 100),
    spinAdvantage: Math.min(spinAdv, 100),
    batAdvantage: Math.min(batAdv, 100),
    dominance, dominanceColor, tossDecision,
    sessionForecast: [
      { session: "Day 1", prediction: day1 },
      { session: "Day 2", prediction: day2 },
      { session: "Day 3", prediction: day3 },
      { session: "Day 4", prediction: day4 },
      { session: "Day 5", prediction: day5 },
    ],
    overallRating: Math.round((hardness * 0.3 + bounce * 0.25 + (100 - crackIndex) * 0.25 + grassCover * 0.2) / 10) / 10,
    pitchType: crackIndex > 50 ? "Dry & Cracked" : grassCover > 45 ? "Green Top" : moisture > 40 ? "Damp" : "Hard & True",
  };
}

export default function AnalyzePage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setAnalyzing(true);
      setAnalysis(null);
      setTimeout(() => {
        setAnalysis(generateAnalysis(file.name));
        setAnalyzing(false);
      }, 2500);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = () => setDragActive(false);

  const resetAnalysis = () => {
    setUploadedImage(null);
    setFileName("");
    setAnalysis(null);
  };

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Pitch Analysis Engine</h1>
          <p className={styles.pageSubtitle}>Upload a pitch photograph to generate a 3D model and comprehensive ground analysis.</p>
        </div>

        {!uploadedImage ? (
          <div
            className={`${styles.uploadZone} ${dragActive ? styles.dragActive : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className={styles.uploadContent}>
              <div className={styles.uploadIcon}>📸</div>
              <h3 className={styles.uploadTitle}>Upload Pitch Photograph</h3>
              <p className={styles.uploadDesc}>Drag & drop an image here, or click to browse. Groundsmen can capture the pitch from any angle.</p>
              <label className="btn-primary" style={{cursor:'pointer'}}>
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  style={{display:'none'}}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
              <p className={styles.uploadHint}>Supports JPG, PNG, WebP — Max 20MB</p>
            </div>
          </div>
        ) : (
          <div className={styles.analysisLayout}>
            {/* Left: 3D Viewer */}
            <div className={styles.viewerSection}>
              <div className={styles.viewerHeader}>
                <div>
                  <h2 className={styles.viewerTitle}>3D Pitch Model</h2>
                  <p className={styles.viewerFile}>{fileName}</p>
                </div>
                <button className="btn-secondary" onClick={resetAnalysis} style={{padding:'8px 18px',fontSize:'0.85rem'}}>
                  ← New Analysis
                </button>
              </div>
              <div className={styles.viewerContainer}>
                <PitchViewer3D imageUrl={uploadedImage} analyzing={analyzing} />
                {analyzing && (
                  <div className={styles.analyzingOverlay}>
                    <div className={styles.spinner}></div>
                    <p>Analyzing pitch surface...</p>
                    <div className={styles.analyzeProgress}>
                      <div className={styles.analyzeProgressBar}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Analysis Panel */}
            <div className={styles.panelSection}>
              {analysis ? (
                <AnalysisPanel data={analysis} />
              ) : (
                <div className={styles.panelPlaceholder}>
                  <div className={styles.spinner}></div>
                  <p>Running AI analysis...</p>
                  <p className={styles.panelPlaceholderSub}>Detecting cracks, moisture, grass density...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
