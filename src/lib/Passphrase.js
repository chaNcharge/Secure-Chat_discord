/**
 * Most functions borrowed from examples at SubtleCrypto docs
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 */

/**
 * Encrypt passphrase with public key using Web Crypto API's SubtleCrypto interface
 * @param {string} passphrase The passphrase to encrypt
 * @param {CryptoKey} publicKey The public key for encryption
 * @returns {Promise<string>} A promise resolving to the encrypted passphrase as a base64-encoded string
 */
export async function encryptPassphrase(passphrase, publicKey) {
    const encodedPassphrase = new TextEncoder().encode(passphrase);
    const encryptedPassphraseBuffer = await window.crypto.subtle.encrypt({
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
    }, publicKey, encodedPassphrase);
    const encryptedPassphraseArray = new Uint8Array(encryptedPassphraseBuffer);
    return btoa(String.fromCharCode.apply(null, encryptedPassphraseArray));
}

/**
 * Decrypt passphrase with private key using Web Crypto API's SubtleCrypto interface
 * @param {string} encryptedPassphrase The encrypted passphrase as a base64-encoded string
 * @param {CryptoKey} privateKey The private key for decryption
 * @returns {Promise<string>} A promise resolving to the decrypted passphrase
 */
export async function decryptPassphrase(encryptedPassphrase, privateKey) {
    const encryptedPassphraseArray = new Uint8Array(atob(encryptedPassphrase).split("").map(char => char.charCodeAt(0)));
    const decryptedPassphraseBuffer = await window.crypto.subtle.decrypt({
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
    }, privateKey, encryptedPassphraseArray.buffer);
    return new TextDecoder().decode(decryptedPassphraseBuffer);
}
