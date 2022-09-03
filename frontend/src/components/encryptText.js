// cite : https://docs.w3cub.com/dom/subtlecrypto/digest
export async function hashText(text) {
  const encodedText8Array = new TextEncoder().encode(text); // convert text into int8Array for hashing
  const hashArryBuffer = await crypto.subtle.digest('SHA-256', encodedText8Array); // hash the text
  const hashBytesArray = Array.from(new Uint8Array(hashArryBuffer)); // conert buffer array to byte array
  const hashStringHex = hashBytesArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes array to hex string/readable string
  return hashStringHex;
}