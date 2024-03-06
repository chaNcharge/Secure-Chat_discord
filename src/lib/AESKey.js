/**
 * Most functions borrowed from examples at SubtleCrypto docs
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 */

import { ab2str, str2ab } from "./ArrayBuffer";

/**
 * Encrypt AES key with RSA public key using Web Crypto API's SubtleCrypto interface
 * @param {CryptoKey} aesKey The AES key to encrypt
 * @param {CryptoKey} publicKey The RSA public key for encryption
 * @returns {Promise<string>} A promise resolving to the encrypted key as a base64-encoded string
 */
export async function encryptAESKey(aesKey, publicKey) {
    const exportedKey = await window.crypto.subtle.exportKey('raw', aesKey);
    const encryptedPassphraseBuffer = await window.crypto.subtle.encrypt({
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
    }, publicKey, exportedKey);
    return btoa(ab2str(encryptedPassphraseBuffer));
}

/**
 * Decrypt AES Key with RSA private key using Web Crypto API's SubtleCrypto interface
 * @param {string} encryptedAESKey The encrypted AES key as a base64-encoded string
 * @param {CryptoKey} privateKey The private key for decryption
 * @returns {Promise<CryptoKey>} A promise resolving to the decrypted passphrase
 */
export async function decryptAESKey(encryptedAESKey, privateKey) {
    const encryptedAESKeyBuffer = str2ab(atob(encryptedAESKey));
    const decryptedAESKeyBuffer = await window.crypto.subtle.decrypt({
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
    }, privateKey, encryptedAESKeyBuffer);
    return window.crypto.subtle.importKey(
        'raw',
        decryptedAESKeyBuffer,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Export the given key and write it into the "exported-key" space as a base64 encoded string.
 * Note this is not encrypted
 */
export async function exportAESKey(key) {
    const exported = await window.crypto.subtle.exportKey("raw", key);
    return btoa(ab2str(exported));
}

/**
 * Import an unencrypted raw AES secret key from a base64 encoded string containing the raw bytes.
 * Takes an base64 encoded string containing the bytes, and returns a Promise
 * that will resolve to a CryptoKey representing the secret key.
 */
export async function importAESKey(rawKey) {
    const key = str2ab(atob(rawKey));
    return window.crypto.subtle.importKey("raw", key, "AES-GCM", true, [
        "encrypt",
        "decrypt",
    ]);
}