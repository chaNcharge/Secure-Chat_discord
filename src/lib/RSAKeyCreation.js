/**
 * RSA key generation and key import/export functions using Web Crypto API's SubtleCrypto interface.
 * 
 * These functions provide the ability to generate RSA key pairs, export them to base64-encoded strings
 * in PEM format, and import RSA keys from base64-encoded PEM strings.
 * 
 * Most functions are adapted from examples provided in the SubtleCrypto documentation.
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 * 
 * @module RSAKeyUtils
 * @author [Ethan Cha]
 */


import { ab2str, str2ab } from "./ArrayBuffer";

/**
 * Generates an RSA key pair using the Web Crypto API's SubtleCrypto interface.
 * 
 * @param {number} modulusLength - The length of the modulus in bits.
 * @returns {Promise<CryptoKeyPair>} - A promise that resolves to an object containing the public and private keys.
 */
export async function createKeyPair(modulusLength) {
    let keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: modulusLength,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"],
    );
    return keyPair;
}

/**
 * Exports an RSA key CryptoKey object to a base64-encoded string in PEM format.
 * 
 * @param {CryptoKey} key - The CryptoKey object to export.
 * @param {string} keyType - Specifies whether the key is "public" or "private".
 * @returns {Promise<string>} - A promise resolving to a base64-encoded string of the key object.
 */
export async function exportRSAKey(key, keyType) {
    if (keyType === "public") {
        const exported = await window.crypto.subtle.exportKey("spki", key);
        const exportedAsString = ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
        return pemExported;
    } else {
        const exported = await window.crypto.subtle.exportKey("pkcs8", key);
        const exportedAsString = ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
        return pemExported;
    }
}

/**
 * Imports an RSA key from a base64-encoded string in PEM format.
 * 
 * @param {string} pem - A base64-encoded string representing the RSA key in PEM format.
 * @param {string} keyType - Specifies whether the key is "public" or "private".
 * @returns {Promise<CryptoKey>} - A promise resolving to a CryptoKey object.
 */
export async function importRSAKey(pem, keyType) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = keyType === "public" ? "-----BEGIN PUBLIC KEY-----" : "-----BEGIN PRIVATE KEY-----";
    const pemFooter = keyType === "public" ? "-----END PUBLIC KEY-----" : "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(
        pemHeader.length,
        pem.length - pemFooter.length - 1,
    );
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
        keyType === "public" ? "spki" : "pkcs8",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        keyType === "public" ? ["encrypt"] : ["decrypt"]
    );
}