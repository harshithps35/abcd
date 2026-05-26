/**
 * Pitch Analysis Service
 *
 * Analyzes cricket pitch characteristics based on image metadata.
 * In production, this would integrate with a computer vision / ML model.
 * Currently uses deterministic seeding from file metadata for consistent results.
 */

/**
 * Generate a seeded random number from a string (for consistent results per image)
 */
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

function seededInt(seed, min, max) {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}

/**
 * Analyze a pitch image and return comprehensive analysis data
 * @param {string} fileName - Original filename of the uploaded image
 * @param {number} fileSize - File size in bytes
 * @returns {object} Complete pitch analysis
 */
export function analyzePitch(fileName, fileSize) {
  // Use filename + size as seed for consistent results per image
  const seed = `${fileName}-${fileSize}`;

  const moisture = seededInt(seed + "moisture", 10, 55);
  const grassCover = seededInt(seed + "grass", 5, 70);
  const hardness = seededInt(seed + "hard", 40, 85);
  const crackIndex = seededInt(seed + "crack", 5, 80);
  const bounce = seededInt(seed + "bounce", 45, 85);
  const abrasion = seededInt(seed + "abrasion", 15, 70);

  // Calculate player advantages
  const paceAdv = Math.round(
    grassCover * 0.3 + moisture * 0.3 + bounce * 0.2 + (100 - crackIndex) * 0.2
  );
  const spinAdv = Math.round(
    crackIndex * 0.35 + (100 - moisture) * 0.25 + abrasion * 0.25 + (100 - grassCover) * 0.15
  );
  const batAdv = Math.round(
    (100 - crackIndex) * 0.3 + hardness * 0.25 + (100 - abrasion) * 0.2 + bounce * 0.15 + ((100 - moisture > 60) ? 10 : 0) + 5
  );

  // Determine dominance
  let dominance = "Balanced";
  let dominanceColor = "var(--accent-amber)";
  if (paceAdv > spinAdv && paceAdv > batAdv) {
    dominance = "Pace Bowlers";
    dominanceColor = "var(--accent-green)";
  } else if (spinAdv > paceAdv && spinAdv > batAdv) {
    dominance = "Spin Bowlers";
    dominanceColor = "var(--accent-purple)";
  } else if (batAdv > paceAdv && batAdv > spinAdv) {
    dominance = "Batsmen";
    dominanceColor = "var(--accent-blue)";
  }

  // Toss decision with reasoning
  let tossDecision, tossReason;
  if (moisture > 35 || grassCover > 45) {
    tossDecision = "Bowl First";
    tossReason = `High moisture (${moisture}%) and grass cover (${grassCover}%) create ideal conditions for seam movement. Bowling first exploits fresh conditions before the pitch dries out.`;
  } else if (crackIndex > 45) {
    tossDecision = "Bat First";
    tossReason = `Significant cracks (${crackIndex}%) will worsen over time, making batting increasingly difficult. Score heavily while conditions are most favorable.`;
  } else if (hardness > 70 && bounce > 65) {
    tossDecision = "Bat First";
    tossReason = `Hard surface (${hardness}%) with true bounce (${bounce}%) creates excellent batting conditions. Put runs on the board and let the pitch wear.`;
  } else {
    tossDecision = "Bat First";
    tossReason = `Surface offers true bounce (${bounce}%) with manageable conditions. Batting first is advisable to capitalize before deterioration sets in.`;
  }

  // Session-by-session forecast
  const day1 = grassCover > 40
    ? "Pace dominant, expect seam movement with the new ball. Batsmen need watchful starts."
    : "Good for batting with minimal assistance for bowlers. Score heavily in this session.";
  const day2 = "Pitch settling down, offering the best batting conditions of the match. Run-scoring should be easier.";
  const day3 = crackIndex > 30
    ? "Cracks widening visibly, spin starting to grip. Variable bounce beginning to trouble batsmen."
    : "Still good for batting, though the surface is showing early signs of wear.";
  const day4 = "Pitch deteriorating noticeably. Variable bounce and turn expected. Reverse swing comes into play.";
  const day5 = crackIndex > 20
    ? "Rough patches everywhere, significant turn for spinners. Batting survival is the priority."
    : "Worn but still playable. Experienced batsmen can negotiate the conditions.";

  // Overall rating (out of 10)
  const overallRating = Math.round(
    (hardness * 0.3 + bounce * 0.25 + (100 - crackIndex) * 0.25 + grassCover * 0.2) / 10
  ) / 10;

  // Pitch type classification
  let pitchType;
  if (crackIndex > 50) pitchType = "Dry & Cracked";
  else if (grassCover > 45) pitchType = "Green Top";
  else if (moisture > 40) pitchType = "Damp";
  else pitchType = "Hard & True";

  return {
    moisture,
    grassCover,
    hardness,
    crackIndex,
    bounce,
    abrasion,
    paceAdvantage: Math.min(paceAdv, 100),
    spinAdvantage: Math.min(spinAdv, 100),
    batAdvantage: Math.min(batAdv, 100),
    dominance,
    dominanceColor,
    tossDecision,
    tossReason,
    sessionForecast: [
      { session: "Day 1", prediction: day1 },
      { session: "Day 2", prediction: day2 },
      { session: "Day 3", prediction: day3 },
      { session: "Day 4", prediction: day4 },
      { session: "Day 5", prediction: day5 },
    ],
    overallRating: Math.max(overallRating, 1),
    pitchType,
  };
}
