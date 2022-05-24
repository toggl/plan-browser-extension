/**
 * Returns a boolean representing the validity of
 * the specified index i.e. >= 0
 */
export function isValidIndex(index) {
  return Number.isInteger(index) && index >= 0;
}
