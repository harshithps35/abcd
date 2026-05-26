# PitchVision 3D — Cricket Pitch Analysis Platform

Advanced cricket pitch analysis platform with 3D visualization, AI-driven surface assessment, and strategic match intelligence.

## Project Structure

```
├── frontend/          # React (Vite) frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── AnalysisPanel.jsx
│   │   │   └── PitchViewer3D.jsx
│   │   ├── pages/         # Page-level components
│   │   │   ├── Home.jsx
│   │   │   ├── Analyze.jsx
│   │   │   └── Reports.jsx
│   │   ├── App.jsx        # Router configuration
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles & design system
│   ├── index.html
│   └── vite.config.js
│
├── backend/           # Express.js API server
│   ├── services/
│   │   └── pitchAnalysis.js   # Pitch analysis engine
│   └── server.js              # Express server & routes
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Backend
```bash
cd backend
npm install
npm run dev
```
The API will start on `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The app will start on `http://localhost:5173`

## API Endpoints

| Method | Endpoint         | Description                          |
|--------|------------------|--------------------------------------|
| GET    | /api/health      | Health check                         |
| POST   | /api/analyze     | Analyze a pitch image (multipart)    |
| GET    | /api/reports     | Get all pitch reports                |
| GET    | /api/reports/:id | Get a specific report                |

## Features

- **3D Pitch Visualization** — Interactive Three.js terrain model from uploaded images
- **AI Surface Analysis** — Moisture, grass cover, hardness, crack patterns
- **Toss Recommendation** — Clear bat first / bowl first decision with reasoning
- **Player Advantage** — Pace, spin, and batting advantage percentages
- **Session Forecasts** — Day-by-day pitch behavior predictions
- **Reports Database** — Historical venue analysis with search & filtering
