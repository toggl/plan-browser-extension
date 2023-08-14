/** Generates code challenge */
export async function generateCodeChallenge(str) {
  if (window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    return window.crypto.subtle.digest('SHA-256', data).then((hash) => {
      return [base64UrlEncode(hash), 'S256'];
    });
  }
  return Promise.resolve([str, 'plain']);
}

/** Encodes URL to Base64 */
function base64UrlEncode(buf) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
