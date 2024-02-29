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

export async function exportKeyToString(key, keyType) {
    const exportedKey = await window.crypto.subtle.exportKey(
        keyType === 'public' ? 'spki' : 'pkcs8',
        key
    );
    const exportedKeyArray = new Uint8Array(exportedKey);
    const exportedKeyString = btoa(String.fromCharCode.apply(null, exportedKeyArray));
    return exportedKeyString;
}

export async function importStringToKey(keyString, keyType) {
    const binaryString = atob(keyString);
    const keyData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        keyData[i] = binaryString.charCodeAt(i);
    }
    const importedKey = await window.crypto.subtle.importKey('spki' === keyType ? 'spki' : 'pkcs8', keyData.buffer, {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' }
    }, true, keyType === 'public' ? ['encrypt', 'wrapKey'] : ['decrypt', 'unwrapKey']);
    return importedKey;
}