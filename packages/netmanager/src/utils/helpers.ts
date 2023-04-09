export function includes<T>(array: readonly T[], value: T, fromIndex = 0): boolean {
  const startIndex = fromIndex < 0 ? Math.max(0, array.length + fromIndex) : fromIndex;
  return array.slice(startIndex).indexOf(value) !== -1;
}

