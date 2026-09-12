export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const range = (value: number, start: number, end: number) =>
  clamp((value - start) / (end - start));

export const smooth = (value: number, start: number, end: number) => {
  const x = range(value, start, end);
  return x * x * (3 - 2 * x);
};

export const bell = (value: number, enter: number, full: number, leave: number, gone: number) =>
  smooth(value, enter, full) * (1 - smooth(value, leave, gone));
