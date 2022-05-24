/**
 * Converts the given string to Titlecase
 */
export function toTitleCase(text) {
  if (!text?.length) {
    return '';
  }
  return `${text[0]?.toUpperCase()}${text?.substr(1).toLowerCase()}`;
}
