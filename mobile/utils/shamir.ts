import 'react-native-get-random-values';

const PRIME = 257;

function mod(a: number, m: number): number {
  return ((a % m) + m) % m;
}

function randomByte(): number {
  const arr = new Uint8Array(1);
  crypto.getRandomValues(arr);
  return arr[0];
}

function evaluatePolynomial(coeffs: number[], x: number): number {
  let result = 0;
  for (let i = coeffs.length - 1; i >= 0; i--) {
    result = mod(result * x + coeffs[i], PRIME);
  }
  return result;
}

function modInverse(a: number, m: number): number {
  let [old_r, r] = [a, m];
  let [old_s, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  return mod(old_s, m);
}

function splitByte(secret: number, n: number, t: number): number[] {
  const coeffs = [secret];
  for (let i = 1; i < t; i++) {
    coeffs.push(mod(randomByte(), PRIME));
  }
  return Array.from({ length: n }, (_, i) => evaluatePolynomial(coeffs, i + 1));
}

function combineByte(shares: Array<[number, number]>): number {
  let secret = 0;
  for (let i = 0; i < shares.length; i++) {
    const [xi, yi] = shares[i];
    let num = 1, den = 1;
    for (let j = 0; j < shares.length; j++) {
      if (i === j) continue;
      const [xj] = shares[j];
      num = mod(num * (-xj), PRIME);
      den = mod(den * (xi - xj), PRIME);
    }
    secret = mod(secret + yi * num * modInverse(den, PRIME), PRIME);
  }
  return secret;
}

export function split(secret: Buffer, n: number, t: number): Buffer[] {
  const shares: number[][] = Array.from({ length: n }, () => []);
  for (const byte of secret) {
    const parts = splitByte(byte, n, t);
    parts.forEach((p, i) => shares[i].push(p));
  }
  return shares.map((s, i) => Buffer.from([i + 1, ...s]));
}

export function combine(shares: Buffer[]): Buffer {
  const xValues = shares.map(s => s[0]);
  const yArrays = shares.map(s => Array.from(s.slice(1)));
  const secretLen = yArrays[0].length;
  const secret: number[] = [];
  for (let i = 0; i < secretLen; i++) {
    const pts: Array<[number, number]> = shares.map((_, j) => [xValues[j], yArrays[j][i]]);
    secret.push(combineByte(pts));
  }
  return Buffer.from(secret);
}
