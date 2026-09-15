export const cinematicStore = {
  target: 0,
  progress: 0,
  velocity: 0,
  pointer: { x: 0, y: 0 },
  reducedMotion: false,
};

export function cameraZ(progress: number) {
  const keys = [
    { at: 0, z: 13 },
    { at: 0.18, z: 8.2 },
    { at: 0.34, z: 2.8 },
    { at: 0.48, z: -4.2 },
    { at: 0.64, z: -13.5 },
    { at: 0.78, z: -20.2 },
    { at: 0.9, z: -27.8 },
    { at: 1, z: -37.5 },
  ];
  const nextIndex = keys.findIndex((key) => progress <= key.at);
  if (nextIndex <= 0) return keys[0].z;
  const from = keys[nextIndex - 1];
  const to = keys[nextIndex];
  const local = (progress - from.at) / (to.at - from.at);
  const eased = local * local * (3 - 2 * local);
  return from.z + (to.z - from.z) * eased;
}

export function windowed(progress: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}
