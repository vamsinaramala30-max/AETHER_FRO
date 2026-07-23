export const clamp = (val: number, min: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
};

export const roundTo = (val: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
};