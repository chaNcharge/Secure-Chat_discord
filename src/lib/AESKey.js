/**
 * Functions for encrypting and decrypting AES keys with RSA keys using the Web Crypto API's SubtleCrypto interface.
 * 
 * These functions allow for the encryption of AES keys using RSA public keys, as well as the decryption of AES keys
 * using RSA private keys. Additionally, utility functions for exporting and importing AES keys in raw format are provided.
 * 
 * Most functions in this module are adapted from examples provided in the SubtleCrypto documentation.
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 * 
 * @module AESKeyEncryption
 * @author [Ethan Cha]
 */

import { ab2str, str2ab } from "./ArrayBuffer";

/**
 * Encrypts an AES key with an RSA public key using the Web Crypto API's SubtleCrypto interface.
 * 
 * @param {CryptoKey} aesKey - The AES key to encrypt.
 * @param {CryptoKey} publicKey - The RSA public key for encryption.
 * @returns {Promise<string>} - A promise resolving to the encrypted key as a base64-encoded string.
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
 * Decrypts an AES key with an RSA private key using the Web Crypto API's SubtleCrypto interface.
 * 
 * @param {string} encryptedAESKey - The encrypted AES key as a base64-encoded string.
 * @param {CryptoKey} privateKey - The private key for decryption.
 * @returns {Promise<CryptoKey>} - A promise resolving to the decrypted passphrase.
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
 * Exports the given AES key and writes it into a base64-encoded string.
 * Note that this export is not encrypted.
 * 
 * @param {CryptoKey} key - The AES key to export.
 * @returns {Promise<string>} - A promise resolving to a base64-encoded string representing the AES key.
 */
export async function exportAESKey(key) {
    const exported = await window.crypto.subtle.exportKey("raw", key);
    return btoa(ab2str(exported));
}

/**
 * Imports an unencrypted raw AES secret key from a base64-encoded string containing the raw bytes.
 * 
 * @param {string} rawKey - The base64-encoded string containing the bytes of the AES key.
 * @returns {Promise<CryptoKey>} - A promise resolving to a CryptoKey representing the imported AES key.
 */
export async function importAESKey(rawKey) {
    const key = str2ab(atob(rawKey));
    return window.crypto.subtle.importKey("raw", key, "AES-GCM", true, [
        "encrypt",
        "decrypt",
    ]);
}