import { ab2str, str2ab } from "./ArrayBuffer";

/**
 * Encrypt a message with an AES CryptoKey object
 * @param {CryptoKey} key 
 * @param {string} message 
 * @returns {Promise<{ciphertext: string, iv: Uint8Array}>} 
 * A promise resolving to a an object of base64 encoded AES encrypted text
 * with an iv in a Uint8Array
 */
export async function encryptMessage(key, message) {
    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    // Convert the message to an ArrayBuffer
    const encodedMessage = new TextEncoder().encode(message);
    // Encrypt the message using AES-GCM
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedMessage
    );
    // Convert the ciphertext and IV to base64 strings
    const ciphertext = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
    const ivString = btoa(String.fromCharCode.apply(null, iv));
    return { ciphertext: ciphertext, iv: ivString };
}

/**
 * Decrypt ciphertext with an AES CryptoKey object and iv
 * @param {CryptoKey} key 
 * @param {string} ciphertext 
 * @param {Uint8Array} iv 
 * @returns {Promise<string>} A promise resolving to a string of decrypted text
 */
export async function decryptMessage(key, ciphertext, iv) {
     // Decode the IV from base64
     const decodedIV = new Uint8Array(atob(iv).split("").map(char => char.charCodeAt(0)));
     // Convert the ciphertext from base64 to an ArrayBuffer
     const decodedCiphertext = new Uint8Array(atob(ciphertext).split("").map(char => char.charCodeAt(0)));
     // Decrypt the ciphertext using AES-GCM
     const decrypted = await window.crypto.subtle.decrypt(
         {
             name: "AES-GCM",
             iv: decodedIV,
         },
         key,
         decodedCiphertext
     );
     // Convert the decrypted message ArrayBuffer to a string
     return new TextDecoder().decode(decrypted);
} 
