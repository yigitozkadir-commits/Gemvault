/* global btoa, atob */
import { toast } from '../ui/toast.js';

const STORAGE_KEY = 'gv:apiKey:secure';
const DB_NAME = 'gv-secure-store';
const DB_VERSION = 1;

let db = null;
let keyMaterial = null;

async function initDB() {
  if (db) return;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains('keys')) {
        database.createObjectStore('keys', { keyPath: 'id' });
      }
    };
  });
}

async function getOrCreateKeyMaterial() {
  if (!('SubtleCrypto' in window)) return null;

  if (keyMaterial) return keyMaterial;

  try {
    const password = `${navigator.userAgent}${window.location.origin}`;
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);

    keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return keyMaterial;
  } catch (e) {
    console.warn('SubtleCrypto not available:', e.message);
    return null;
  }
}

async function deriveKey(keyMaterial) {
  if (!keyMaterial) return null;

  try {
    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  } catch (e) {
    console.warn('Key derivation failed:', e.message);
    return null;
  }
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptApiKey(apiKey) {
  if (!('SubtleCrypto' in window)) {
    // Fallback: plaintext storage (warn user)
    localStorage.setItem(STORAGE_KEY, `plaintext:${apiKey}`);
    toast.warn('API Key depolanıyor (şifrelenmemiş — güvenli olmayan cihaz)');
    return true;
  }

  try {
    await initDB();
    const keyMaterial = await getOrCreateKeyMaterial();
    const key = await deriveKey(keyMaterial);

    if (!key) {
      localStorage.setItem(STORAGE_KEY, `plaintext:${apiKey}`);
      return true;
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);

    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

    const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    localStorage.setItem(STORAGE_KEY, `encrypted:${arrayBufferToBase64(combined.buffer)}`);
    return true;
  } catch (e) {
    console.warn('Encryption failed, falling back to plaintext:', e.message);
    localStorage.setItem(STORAGE_KEY, `plaintext:${apiKey}`);
    return true;
  }
}

export async function decryptApiKey() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return '';

  const [type, data] = stored.split(':');

  if (type === 'plaintext') {
    return data;
  }

  if (type === 'encrypted' && 'SubtleCrypto' in window) {
    try {
      await initDB();
      const keyMaterial = await getOrCreateKeyMaterial();
      const key = await deriveKey(keyMaterial);

      if (!key) return data;

      const combined = new Uint8Array(base64ToArrayBuffer(data));
      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);

      const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
      const decoder = new TextDecoder();
      return decoder.decode(plaintext);
    } catch (e) {
      console.warn('Decryption failed:', e.message);
      return '';
    }
  }

  return '';
}

export async function clearEncryptedKey() {
  localStorage.removeItem(STORAGE_KEY);
  if (db) {
    const transaction = db.transaction(['keys'], 'readwrite');
    transaction.objectStore('keys').clear();
  }
}
