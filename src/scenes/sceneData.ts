export type Motif = "arch" | "books" | "palace" | "ink" | "mirror" | "montage" | "door" | "garden" | "thread" | "moon" | "hands" | "silence" | "return" | "storm" | "crown" | "gate" | "prayer" | "home" | "years" | "wedding";

export type SceneConfig = {
  id: number;
  internalName: string;
  motif: Motif;
  sky: string;
  horizon: string;
  stone: string;
  light: string;
  water: string;
  waterfall: boolean;
  storm: number;
  warmth: number;
};

export const scenes: SceneConfig[] = [
  { id: 1, internalName: "The Book With No Memories", motif: "arch", sky: "#07142b", horizon: "#243f65", stone: "#66758b", light: "#efb963", water: "#09213c", waterfall: true, storm: .1, warmth: .35 },
  { id: 2, internalName: "The Princess in the Pages", motif: "books", sky: "#0b1738", horizon: "#3d4d80", stone: "#b8b4a9", light: "#f2cb7d", water: "#102d50", waterfall: true, storm: 0, warmth: .5 },
  { id: 3, internalName: "The Private Page", motif: "palace", sky: "#101c3b", horizon: "#4f5e88", stone: "#e3ddd0", light: "#f1c77c", water: "#173853", waterfall: true, storm: 0, warmth: .58 },
  { id: 4, internalName: "The Mirror Spell", motif: "ink", sky: "#111a34", horizon: "#41577c", stone: "#c9c1ae", light: "#c8dafa", water: "#112b49", waterfall: false, storm: .05, warmth: .38 },
  { id: 5, internalName: "When Her Voice Became Home", motif: "mirror", sky: "#0a1229", horizon: "#3d4d70", stone: "#948d83", light: "#e5c486", water: "#0b243f", waterfall: false, storm: .12, warmth: .55 },
  { id: 6, internalName: "The Words He Said Too Soon", motif: "montage", sky: "#15203a", horizon: "#875f63", stone: "#8d8277", light: "#efa36d", water: "#162c44", waterfall: true, storm: .42, warmth: .26 },
  { id: 7, internalName: "The Friendship That Stayed", motif: "door", sky: "#11172c", horizon: "#58617a", stone: "#7d7771", light: "#dfaa68", water: "#10263d", waterfall: true, storm: .7, warmth: .2 },
  { id: 8, internalName: "Love Without a Beginning Date", motif: "garden", sky: "#111a34", horizon: "#5b6788", stone: "#b4aa98", light: "#efc273", water: "#123149", waterfall: true, storm: .05, warmth: .66 },
  { id: 9, internalName: "Hayati", motif: "thread", sky: "#07122b", horizon: "#3e4d79", stone: "#a69c8c", light: "#f3c96f", water: "#0a2947", waterfall: false, storm: 0, warmth: .74 },
  { id: 10, internalName: "The Distance Between Their Hands", motif: "moon", sky: "#050d22", horizon: "#32456d", stone: "#8b8990", light: "#f1d48e", water: "#071e39", waterfall: true, storm: .08, warmth: .64 },
  { id: 11, internalName: "The Nights the Books Went Silent", motif: "hands", sky: "#071024", horizon: "#314361", stone: "#777987", light: "#bdcff0", water: "#081d33", waterfall: false, storm: .2, warmth: .3 },
  { id: 12, internalName: "The Road Back to Each Other", motif: "silence", sky: "#07101f", horizon: "#28384e", stone: "#666b73", light: "#9aaec7", water: "#061728", waterfall: true, storm: .36, warmth: .1 },
  { id: 13, internalName: "Before We Sleep", motif: "return", sky: "#0c1530", horizon: "#4f5d7a", stone: "#989082", light: "#e7bc76", water: "#0c2943", waterfall: true, storm: .12, warmth: .52 },
  { id: 14, internalName: "The Girl Behind the Crown", motif: "storm", sky: "#0c1429", horizon: "#50566d", stone: "#8a817a", light: "#d5ab72", water: "#10263b", waterfall: true, storm: .9, warmth: .24 },
  { id: 15, internalName: "The Gate They Chose to Wait For", motif: "crown", sky: "#111a32", horizon: "#695a70", stone: "#d1c7b7", light: "#efbd75", water: "#15334a", waterfall: true, storm: .08, warmth: .58 },
  { id: 16, internalName: "Prayers Under One Moon", motif: "gate", sky: "#030b1d", horizon: "#1b3152", stone: "#d7d5ce", light: "#e8e0c7", water: "#020d18", waterfall: true, storm: .3, warmth: .25 },
  { id: 17, internalName: "The House Beyond Tomorrow", motif: "prayer", sky: "#071126", horizon: "#334b72", stone: "#a9a69f", light: "#f0d092", water: "#0a2139", waterfall: false, storm: 0, warmth: .5 },
  { id: 18, internalName: "The Years Ahead", motif: "home", sky: "#17233b", horizon: "#c17b63", stone: "#d8c8ae", light: "#ffc783", water: "#1d3d4c", waterfall: true, storm: 0, warmth: .88 },
  { id: 19, internalName: "The Wedding Beyond the Gate", motif: "years", sky: "#09132c", horizon: "#4a5c83", stone: "#a8a39a", light: "#e9c986", water: "#0d2b47", waterfall: true, storm: .05, warmth: .62 },
  { id: 20, internalName: "Until the Gate Opens", motif: "wedding", sky: "#171b31", horizon: "#b77d73", stone: "#eee7db", light: "#f5cf8e", water: "#1a3e4b", waterfall: true, storm: 0, warmth: .95 },
];

export const finale = { ...scenes[0], id: 21, internalName: "Finale", motif: "gate" as const, warmth: .42 };
