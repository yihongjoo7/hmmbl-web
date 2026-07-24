/**
 * DPoP (Demonstrating Proof of Possession) — RFC 9449
 *
 * - ES256 키쌍을 생성하여 IndexedDB에 저장
 * - API 요청마다 DPoP proof JWT를 생성
 * - WebView 환경(HTTPS)에서만 동작 (SubtleCrypto 필요)
 */

export const DPOP_DB_NAME = 'hpoint-dpop';
export const DPOP_DB_STORE = 'keypair';
export const DPOP_KEY_ID = 'dpop-key';

const DB_NAME = DPOP_DB_NAME;
const STORE_NAME = DPOP_DB_STORE;
const KEY_ID = DPOP_KEY_ID;

// ── IndexedDB 헬퍼 ──────────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

async function dbSet(key: string, value: unknown): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function dbDelete(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ── 키쌍 관리 ───────────────────────────────────────────────────────────────

export async function generateDPoPKeyPair(): Promise<CryptoKeyPair> {
  const kp = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign', 'verify']
  );
  await dbSet(KEY_ID, kp);
  return kp;
}

export async function getDPoPKeyPair(): Promise<CryptoKeyPair | null> {
  return (await dbGet<CryptoKeyPair>(KEY_ID)) ?? null;
}

export async function getOrCreateKeyPair(): Promise<CryptoKeyPair> {
  const existing = await getDPoPKeyPair();
  return existing ?? generateDPoPKeyPair();
}

export async function deleteDPoPKeyPair(): Promise<void> {
  await dbDelete(KEY_ID);
}

// ── Base64URL 유틸 ──────────────────────────────────────────────────────────

function base64urlEncode(data: ArrayBuffer | Uint8Array): string {
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function jsonToBase64url(obj: object): string {
  return base64urlEncode(new TextEncoder().encode(JSON.stringify(obj)));
}

// ── DPoP Proof 생성 ─────────────────────────────────────────────────────────

export async function createDPoPProof(url: string, method: string): Promise<string> {
  const kp = await getOrCreateKeyPair();
  const jwk = await crypto.subtle.exportKey('jwk', kp.publicKey);
  const { d, ...publicJwk } = jwk as JsonWebKey & { d?: string };
  void d;

  const header = { typ: 'dpop+jwt', alg: 'ES256', jwk: publicJwk };
  const payload = {
    jti: crypto.randomUUID(),
    htm: method.toUpperCase(),
    htu: url.split('?')[0],
    iat: Math.floor(Date.now() / 1000),
  };

  const signingInput = `${jsonToBase64url(header)}.${jsonToBase64url(payload)}`;
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    kp.privateKey,
    new TextEncoder().encode(signingInput)
  );

  return `${signingInput}.${base64urlEncode(signature)}`;
}
