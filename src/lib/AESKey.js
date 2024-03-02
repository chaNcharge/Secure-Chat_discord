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
    //const encryptedPassphraseArray = new Uint8Array(encryptedPassphraseBuffer);
    //return btoa(String.fromCharCode.apply(null, encryptedPassphraseArray));
}

/**
 * Decrypt AES Key with RSA private key using Web Crypto API's SubtleCrypto interface
 * @param {string} encryptedAESKey The encrypted AES key as a base64-encoded string
 * @param {CryptoKey} privateKey The private key for decryption
 * @returns {Promise<CryptoKey>} A promise resolving to the decrypted passphrase
 */
export async function decryptAESKey(encryptedAESKey, privateKey) {
    //const encryptedAESKeyArray = new Uint8Array(atob(encryptedAESKey).split("").map(char => char.charCodeAt(0)));
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
