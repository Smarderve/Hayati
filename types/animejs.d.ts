declare module "animejs" {
  type AnimeParams = Record<string, unknown>;
  type Anime = ((params: AnimeParams) => { pause: () => void }) & {
    setDashoffset: (element: SVGPathElement) => number;
  };
  const anime: Anime;
  export default anime;
}
