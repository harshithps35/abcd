import express from "express";
import cors from "cors";
import multer from "multer";
import { analyzePitch } from "./services/pitchAnalysis.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer config for image uploads (stored in memory for processing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "PitchVision 3D API", timestamp: new Date().toISOString() });
});

// Analyze pitch image
app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const { originalname, size, mimetype } = req.file;
    console.log(`📸 Analyzing pitch image: ${originalname} (${(size / 1024).toFixed(1)}KB, ${mimetype})`);

    // Simulate processing delay (replace with real AI model later)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate analysis from image metadata
    const analysis = analyzePitch(originalname, size);

    console.log(`✅ Analysis complete: ${analysis.pitchType} — ${analysis.tossDecision}`);
    res.json(analysis);
  } catch (error) {
    console.error("❌ Analysis error:", error);
    res.status(500).json({ error: "Failed to analyze pitch image" });
  }
});

// Get sample reports
app.get("/api/reports", (req, res) => {
  const { filter } = req.query;
  let reports = getSampleReports();

  if (filter && filter !== "All") {
    reports = reports.filter((r) => {
      if (filter === "Pace") return r.dominance === "Pace Bowlers";
      if (filter === "Spin") return r.dominance === "Spin Bowlers";
      if (filter === "Bat") return r.dominance === "Batsmen";
      if (filter === "Balanced") return r.dominance === "Balanced";
      return true;
    });
  }

  res.json(reports);
});

// Get single report by ID
app.get("/api/reports/:id", (req, res) => {
  const report = getSampleReports().find((r) => r.id === parseInt(req.params.id));
  if (!report) return res.status(404).json({ error: "Report not found" });
  res.json(report);
});

// ─── Sample Data ─────────────────────────────────────────────────────────────

function getSampleReports() {
  return [
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
}

// ─── Start Server ────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🏏 PitchVision 3D API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Analyze: POST http://localhost:${PORT}/api/analyze`);
  console.log(`   Reports: GET http://localhost:${PORT}/api/reports\n`);
});
