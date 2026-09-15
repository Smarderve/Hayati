import { scenes } from "@/src/scenes/sceneData";

export const FILM_LENGTH = scenes.length;
export const SCENE_SPACING = 34;

export const filmStore = {
  target: 0,
  progress: 0,
  velocity: 0,
  pointer: { x: 0, y: 0 },
  activeScene: 0,
  reducedMotion: false,
};

export function scenePosition(index: number) {
  return -index * SCENE_SPACING;
}

export function sceneFloat(progress: number) {
  return progress * FILM_LENGTH;
}

export function sceneIndex(progress: number) {
  return Math.min(FILM_LENGTH - 1, Math.floor(sceneFloat(progress)));
}

export function sceneLocal(progress: number) {
  const value = sceneFloat(progress);
  return value >= FILM_LENGTH ? 1 : value - Math.floor(value);
}

export function range(progress: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}
