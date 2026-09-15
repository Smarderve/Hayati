export type PortalSkin = "arch" | "book" | "mirror" | "water" | "memory" | "moon" | "gate";

export const STORY_BEATS = [
  { id: "asterra", start: 0, end: .055, plate: 0, portal: "arch", warmth: .35, storm: 0 },
  { id: "faraway", start: .055, end: .105, plate: 0, portal: "book", warmth: .5, storm: 0 },
  { id: "discovery", start: .105, end: .15, plate: 1, portal: "book", warmth: .58, storm: 0 },
  { id: "private", start: .15, end: .195, plate: 1, portal: "memory", warmth: .62, storm: 0 },
  { id: "mirror", start: .195, end: .245, plate: 1, portal: "mirror", warmth: .68, storm: 0 },
  { id: "bond", start: .245, end: .3, plate: 1, portal: "memory", warmth: .75, storm: 0 },
  { id: "confession", start: .3, end: .345, plate: 0, portal: "arch", warmth: .25, storm: .85 },
  { id: "friendship", start: .345, end: .39, plate: 2, portal: "water", warmth: .5, storm: .15 },
  { id: "love", start: .39, end: .435, plate: 1, portal: "memory", warmth: .72, storm: 0 },
  { id: "hayati", start: .435, end: .475, plate: 0, portal: "moon", warmth: .82, storm: 0 },
  { id: "distance", start: .475, end: .525, plate: 1, portal: "mirror", warmth: .5, storm: .2 },
  { id: "silence", start: .525, end: .575, plate: 0, portal: "arch", warmth: .08, storm: .7 },
  { id: "road-back", start: .575, end: .62, plate: 2, portal: "water", warmth: .58, storm: .12 },
  { id: "maturity", start: .62, end: .665, plate: 1, portal: "mirror", warmth: .55, storm: .55 },
  { id: "zahraan", start: .665, end: .71, plate: 2, portal: "book", warmth: .8, storm: 0 },
  { id: "true-gate", start: .71, end: .765, plate: 0, portal: "gate", warmth: .42, storm: .25 },
  { id: "prayer", start: .765, end: .805, plate: 0, portal: "moon", warmth: .35, storm: 0 },
  { id: "tomorrow", start: .805, end: .855, plate: 2, portal: "memory", warmth: .88, storm: 0 },
  { id: "years", start: .855, end: .905, plate: 2, portal: "moon", warmth: .72, storm: .12 },
  { id: "wedding", start: .905, end: .955, plate: 1, portal: "gate", warmth: 1, storm: 0 },
  { id: "finale", start: .955, end: 1, plate: 0, portal: "gate", warmth: .48, storm: 0 },
] as const;

export function beatAt(progress: number) {
  return STORY_BEATS.find((beat) => progress >= beat.start && progress < beat.end) ?? STORY_BEATS.at(-1)!;
}

export function localProgress(progress: number) {
  const beat = beatAt(progress);
  return Math.max(0, Math.min(1, (progress - beat.start) / (beat.end - beat.start)));
}
