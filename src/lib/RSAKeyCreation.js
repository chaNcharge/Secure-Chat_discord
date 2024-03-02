/**
 * Most functions borrowed from examples at SubtleCrypto docs
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 */

import { ab2str, str2ab } from "./ArrayBuffer";

/**
 * Creates RSA keypair using Web Crypto API's SubtleCrypto interface.
 * @param {number} modulusLength The length of the modulus in bits
 * @returns {Promise<CryptoKeyPair>} A promise that resolves to an object containing the public and private keys
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
        ["encrypt", "decrypt", "wrapKey", "unwrapKey"],
    );
    return keyPair;
}

/**
 * Export key CryptoKey object to string
 * @param {CryptoKey} key The CryptoKey object to export
 * @param {string} keyType Two options, "public" or "private" depending on type of key format
 * @returns {Promise<string>} A promise resolving to a string encoded in base64 of the key object
 */
export async function exportKeyToString(key, keyType) {
    if (keyType === "private") {
        const exported = await window.crypto.subtle.exportKey("pkcs8", key);
        const exportedAsString = ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
        return pemExported;
    } else {
        const exported = await window.crypto.subtle.exportKey("spki", key);
        const exportedAsString = ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
        return pemExported;
    }
}

/**
 * Import base64 encoded string of a CryptoKey object
 * @param {string} pem A CryptoKey base64 encoded string
 * @param {string} keyType Two options, "public" or "private" depending on type of key format
 * @returns {Promise<CryptoKey>} A promise resolving to a CryptoKey object
 */
export async function importStringToKey(pem, keyType) {
    if (keyType === "public") {
        // fetch the part of the PEM string between header and footer
        const pemHeader = "-----BEGIN PUBLIC KEY-----";
        const pemFooter = "-----END PUBLIC KEY-----";
        const pemContents = pem.substring(
            pemHeader.length,
            pem.length - pemFooter.length - 1,
        );
        // base64 decode the string to get the binary data
        const binaryDerString = window.atob(pemContents);
        // convert from a binary string to an ArrayBuffer
        const binaryDer = str2ab(binaryDerString);

        return window.crypto.subtle.importKey(
            "spki",
            binaryDer,
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            },
            true,
            ["encrypt"],
        );
    } else {
        // fetch the part of the PEM string between header and footer
        const pemHeader = "-----BEGIN PRIVATE KEY-----";
        const pemFooter = "-----END PRIVATE KEY-----";
        const pemContents = pem.substring(
            pemHeader.length,
            pem.length - pemFooter.length - 1,
        );
        // base64 decode the string to get the binary data
        const binaryDerString = window.atob(pemContents);
        // convert from a binary string to an ArrayBuffer
        const binaryDer = str2ab(binaryDerString);

        return window.crypto.subtle.importKey(
            "pkcs8",
            binaryDer,
            {
                name: "RSA-PSS",
                hash: "SHA-256",
            },
            true,
            ["decrypt"],
        );
    }
}