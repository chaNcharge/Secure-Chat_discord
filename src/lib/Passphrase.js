import crypto from "crypto";

/**
 * Encrypt passphrase with public key
 * @param {*} passphrase 
 * @param {*} publicKey 
 * @returns 
 */
function encryptPassphrase(passphrase, publicKey) {
    return crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    }, Buffer.from(passphrase, 'utf8'));
}

/**
 * Decrypt passphrase with private key
 * @param {*} encryptedPassphrase 
 * @param {*} privateKey 
 * @returns 
 */
function decryptPassphrase(encryptedPassphrase, privateKey) {
    return crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
    }, encryptedPassphrase);
}