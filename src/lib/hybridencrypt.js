import { ab2str, str2ab } from "./ArrayBuffer";

/**
 * Encrypt a message with an AES CryptoKey object
 * @param {CryptoKey} key 
 * @param {string} message 
 * @returns {Promise<{ciphertext: string, iv: number[]}>} 
 * A promise resolving to a an object of base64 encoded AES encrypted text
 * with an iv in a Uint8Array
 */
export async function encryptMessage(key, message) {
    const encoded = getMessageEncoding(message);
    // iv will be needed for decryption
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoded,
    )
    return {
        ciphertext: btoa(ab2str(ciphertext)),
        iv: Array.from(iv)
    };
}

/**
 * Decrypt ciphertext with an AES CryptoKey object and iv
 * @param {CryptoKey} key 
 * @param {string} ciphertext 
 * @param {number[]} iv 
 * @returns {Promise<string>} A promise resolving to a string of decrypted text
 */
export async function decryptMessage(key, ciphertext, iv) {
    // The iv value is the same as that used for encryption
    const ivUint8 = new Uint8Array(iv);
    const textbuffer = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: ivUint8 }, key, str2ab(atob(ciphertext)));
    return ab2str(textbuffer);
} 

function getMessageEncoding(message) {
    let enc = new TextEncoder();
    return enc.encode(message);
}
