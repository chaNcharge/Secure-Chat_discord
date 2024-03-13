/**
 * AES encryption and decryption functions for secure message transmission.
 * 
 * These functions provide encryption and decryption capabilities using the AES-GCM algorithm
 * for secure message transmission over networks.
 * 
 * @module AESCrypt
 * @author [Ethan Cha]
 */

import { ab2str, str2ab } from "./ArrayBuffer";

/**
 * Encrypts a message with an AES CryptoKey object.
 * 
 * @param {CryptoKey} key - The CryptoKey object used for encryption.
 * @param {string} message - The message to be encrypted.
 * @returns {Promise<{ciphertext: string, iv: number[]}>} - A promise resolving to an object
 * containing the base64-encoded AES encrypted text (ciphertext) and the initialization vector (iv)
 * in the form of an array of numbers.
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
 * Decrypts ciphertext with an AES CryptoKey object and iv.
 * 
 * @param {CryptoKey} key - The CryptoKey object used for decryption.
 * @param {string} ciphertext - The base64-encoded ciphertext to be decrypted.
 * @param {number[]} iv - The initialization vector used for encryption.
 * @returns {Promise<string>} - A promise resolving to the decrypted text.
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
