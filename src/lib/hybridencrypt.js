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

}

/**
 * Decrypt ciphertext with an AES CryptoKey object and iv
 * @param {CryptoKey} key 
 * @param {string} ciphertext 
 * @param {Uint8Array} iv 
 * @returns {Promise<string>} A promise resolving to a string of decrypted text
 */
export async function decryptMessage(key, ciphertext, iv) {

} 
