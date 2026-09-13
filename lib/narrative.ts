export const STORY = {
  opening: { in: 0, focus: 0.035, out: 0.105 },
  moon: { in: 0.04, focus: 0.115, out: 0.205 },
  years: { in: 0.145, focus: 0.215, out: 0.285 },
  everything: { in: 0.25, focus: 0.32, out: 0.39 },
  garden: { in: 0.325, focus: 0.42, out: 0.52 },
  playful: { in: 0.405, focus: 0.48, out: 0.56 },
  future: { in: 0.47, focus: 0.62, out: 0.745 },
  letter: { in: 0.70, focus: 0.78, out: 0.855 },
  return: { in: 0.81, focus: 0.895, out: 0.96 },
  final: { in: 0.905, focus: 0.975, out: 1 },
} as const;

export const FUTURE_MOMENTS = {
  promise: [0.50, 0.535] as const,
  journey: [0.535, 0.575] as const,
  home: [0.575, 0.615] as const,
  family: [0.615, 0.655] as const,
  dreams: [0.655, 0.695] as const,
  years: [0.695, 0.735] as const,
} as const;

export const COPY_BEATS = [
  "opening-beat",
  "moon-beat",
  "years-beat",
  "everything-beat",
  "garden-beat",
  "playful-beat",
  "future-beat",
  "future-details-beat",
  "letter-beat",
  "letter-second",
  "return-beat",
  "final-beat",
] as const;
