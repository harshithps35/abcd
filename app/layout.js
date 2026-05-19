import "./globals.css";

export const metadata = {
  title: "PitchVision 3D — Cricket Pitch Analysis Platform",
  description: "Advanced cricket pitch analysis platform with 3D visualization. Analyze pitch conditions, assess ground behavior for batsmen, pace bowlers, and spin bowlers.",
  keywords: "cricket, pitch analysis, 3D pitch, ground analysis, cricket technology",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
